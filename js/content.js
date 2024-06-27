$(document).ready(function() {
    $('#submitButton').show();
    $('.spin-loader').hide();
    var conversationHistory = []; // Initialize conversation history
  
    function submitForm() {
      var textInput = $('input[name="fname"]').val(); // Get text input value
      $('.spin-loader').show();
      $('#submitButton').hide();
  
      // Prepare data object
      var formData = {
        text: textInput,
      };
  
      // Show loading message
      $('#loadingMessage').show();
  
      function escapeHtml(html) {
        return html.replace(/<br><br>/g, "brbr")
          .replace(/<br>/g, "br")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/br/g, '<br>');
      }
  
      // Send AJAX request
      $.ajax({
        type: 'POST',
        url: 'https://image-generator-api-5h7w.onrender.com/content_generator',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
          // Handle success response
          console.log('Data submitted successfully:', response);
  
          $('#loadingMessage').hide();
          $('.spin-loader').hide();
          $('#submitButton').show();
  
          response = escapeHtml(response);
          console.log(response);
  
          // Store conversation history
          conversationHistory.push({ user: textInput, assistant: response });
  
          // Update conversation history display
          updateConversationHistory();
        },
        error: function(xhr, status, error) {
          // Handle error response
          console.error('Error:', error);
  
          // Hide loading message
          $('#loadingMessage').hide();
          $('.spin-loader').hide();
          $('#submitButton').show();
  
          // Display error message
          $('#conversationHistoryContainer').html('<div style="color: red;">Error: ' + error + '</div>');
        },
      });
    }
  
    function updateConversationHistory() {
      $('#conversationHistoryContainer').empty(); // Clear existing content
  
      conversationHistory.forEach(function(conversation) {
        var cardHtml = `
          <div class="col-sm-12 conversation-card">
            <div class="card px-3 text-dark font-weight-normal">
              <div class="user-message">
                <h5 style="font-weight:400 !important;font-size:1rem !important">User: ${conversation.user}</h5>
              </div>
              <div class="assistant-reply">
                <h5 style="font-weight:400 !important;font-size:1rem !important">Assistant: ${conversation.assistant}</h5>
              </div>
            </div>
          </div>`;
        $('#conversationHistoryContainer').append(cardHtml);
      });
    }
  
    $('#submitButton').click(function(event) {
      event.preventDefault();
      submitForm();
    });
  
    $('input').keypress(function(event) {
      if (event.which == 13) { // Check if Enter key is pressed
        event.preventDefault();
        submitForm();
      }
    });
  });
  
