// Ajax Form Submission
$(document).ready(function() {
    // Handle form submission
    $('#submitButton').click(function() {
        // Show loading message
        $('#loadingMessage').show();

        // Get form data
        var textInput = $('input[name="fname"]').val(); // Get text input text

        // Prepare data object
        var formData = {
            text: textInput,
        };
        $('#imageCardsContainer').empty();

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
            url: 'http://localhost:8000/content_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                // Handle success response
                console.log('Data submitted successfully:', response);
                
                // Clear previous image cards
                $('#loadingMessage').hide();
                response = escapeHtml(response)
                console.log(response)
                
                // Create image cards for each URL in the response
                var cardHtml = '<div class="col-sm-12">' +
                    '<div class="card px-3 text-dark font-weight-normal">' +
                    '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response + '</h5>' +
                    '</div>' +
                    '</div>';
                $('#imageCardsContainer').append(cardHtml);
            },
            error: function(xhr, status, error) {
                // Handle error response
                console.error('Error:', error);

                // Hide loading message
                $('#loadingMessage').hide();

                // Display error message
                $('#imageCardsContainer').html('<div style="color: red;">Error: ' + error + '</div>');
            },
        });
    });
});
