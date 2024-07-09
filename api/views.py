from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, UserSerializer
import json
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import service_pb2_grpc, resources_pb2, service_pb2
from clarifai_grpc.grpc.api.status import status_code_pb2
from django.contrib.auth.models import User
from dotenv import load_dotenv
import os

load_dotenv()

# Clarifai API setup
PAT = os.environ.get("PAT")
USER_ID = 'openai'
APP_ID = 'chat-completion'
MODEL_ID = 'gpt-4o'
MODEL_VERSION_ID = '1cd39c6a109f4f0e94f1ac3fe233c207'

channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)

metadata = (('authorization', 'Key ' + PAT),)

userDataObject = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        user_message = request.data.get('message', '')

        if not user_message:
            return Response({"error": "Please enter a message"}, status=status.HTTP_400_BAD_REQUEST)

        # Save user message
        Message.objects.create(conversation=conversation, role='user', content=user_message)

        # Prepare conversation history
        conversation_history = [
            {'role': 'system', 'content': 'You are a kind helpful assistant'}
        ] + [
            {'role': msg.role, 'content': msg.content}
            for msg in conversation.messages.all().order_by('created_at')
        ]

        try:
            # Call Clarifai API
            post_model_outputs_response = stub.PostModelOutputs(
                service_pb2.PostModelOutputsRequest(
                    user_app_id=userDataObject,
                    model_id=MODEL_ID,
                    version_id=MODEL_VERSION_ID,
                    inputs=[
                        resources_pb2.Input(
                            data=resources_pb2.Data(
                                text=resources_pb2.Text(
                                    raw=json.dumps(conversation_history)
                                )
                            )
                        )
                    ]
                ),
                metadata=metadata
            )

            if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
                raise Exception(f"Post model outputs failed, status: {post_model_outputs_response.status.description}")

            output = post_model_outputs_response.outputs[0]
            reply = output.data.text.raw

            print(reply)

            # Save assistant message
            Message.objects.create(conversation=conversation, role='assistant', content=reply)

            return Response({
                'message': format_message_for_frontend(reply),
                'conversation': ConversationSerializer(conversation).data
            })

        except Exception as exc:
            error = str(exc)
            if "404" in error:
                return Response({"error": "Resource not found. Please check your Model ID and Version ID."}, status=status.HTTP_404_NOT_FOUND)
            elif "403" in error:
                return Response({"error": "Access forbidden. Please check your API key permissions."}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": f"An unexpected error occurred: {error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def format_message_for_frontend(message):
        # Example function to format message with newlines for frontend display
        return message.replace('\n', '<br/>')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow anyone to register
    http_method_names = ['post']  # Only allow POST requests (for registration)