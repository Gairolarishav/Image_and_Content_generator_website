// Text Animation
function consoleText(words, id) {
    var target = document.getElementById(id);
    var letterCount = 0;
    var visible = true;

    setInterval(function () {
        var text = words[0].substring(0, letterCount);
        target.innerHTML = text;
        letterCount++;

        if (letterCount === words[0].length + 1) {
            letterCount = 0;
            words.push(words.shift());
        }
    }, 200);

}

consoleText(['Generate Content With AI'], 'console');


// Ajax Form Submission
$(document).ready(function() {
    // Handle form submission
    $('#submitButton').click(function() {
        // Show loading message
        $('#loadingMessage').show();

        // Get form data
        var textInput = $('input[name="fname"]').val(); // Get text input value

        // Prepare data object
        var formData = {
            text: textInput,
        };

         // Clear previous image cards
         $('#imageCardsContainer').empty();

        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: 'https://image-generator-api-3jrs.onrender.com/content_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                // Handle success response
                console.log('Data submitted successfully:', response_html);
                
                $('#loadingMessage').hide();
                
                // Create image cards for each URL in the response
                var cardHtml = '<div class="col-sm-12">' +
                    '<div class="card px-3 text-dark font-weight-normal">' +
                    '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response_html + '</h5>' +
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


