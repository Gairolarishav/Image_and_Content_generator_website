from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, UserViewSet

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]