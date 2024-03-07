/// Ajax Form Submission
$(document).ready(function() {
    // Handle form submission
    $('#submitButton').show()
    $('.spin-loader').hide()

    $('#submitButton').click(function() {
        var textInput = $('input[name="fname"]').val(); // Get text input value

        
        $('.spin-loader').show()
        $('#submitButton').hide()
        // Prepare data object
        var formData = {
            text: textInput,
        };

        // Show loading message
        $('#loadingMessage').show();

        // Clear previous image cards
        $('#imageCardsContainer').empty();

        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: 'https://image-generator-api-3jrs.onrender.com/image_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                // Handle success response
                console.log('Data submitted successfully:', response);

                $('#loadingMessage').hide();
                $('.spin-loader').hide()
                $('#submitButton').show()

                if (typeof response == 'string' ) {
                    console.log('not a list :' ,response)
                    var cardHtml = '<div class="col-sm-12">' +
                 '<div class="card px-3 text-dark font-weight-normal">' +
                 '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response + '</h5>' +
                 '</div>' +
                 '</div>';
                  $('#imageCardsContainer').append(cardHtml);
                  
                }
                else{// Create image cards for each URL in the response
                    response.forEach(function(image, index) {
                        console.log('list:' ,image)
                        var cardHtml = '<div class="col-sm-3">' +
                            '<div class="card">' +
                            '<img src="data:image/png;base64,' + image + '" class="card-img-top" alt="...">' +
                            '<div class="card-body">' +
                            '<a href="data:image/png;base64,' + image + '" download="' + index + '.png"><button class="btn btn-primary download-btn">Download</button></a>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        $('#imageCardsContainer').append(cardHtml);
                    });
                    }

                // Hide loading message
                $('#loadingMessage').hide();
            },
            error: function(xhr, status, error) {
                // Handle error response
                console.log('Error:', error);

                // Hide loading message
                $('#loadingMessage').hide();

                $('.spin-loader').hide()
                $('#submitButton').show()

                // Display error message
                var errorMessage = xhr.responseJSON && xhr.responseJSON.detail ? xhr.responseJSON.detail : 'Something went wrong try after few minutes';
                var cardHtml = '<div class="col-sm-12">' +
                    '<div class="card px-3 text-dark font-weight-normal">' +
                    '<h5 style="font-weight:400 !important;font-size:1rem !important">' + errorMessage + '</h5>' +
                    '</div>' +
                    '</div>';
                     $('#imageCardsContainer').append(cardHtml);
            }
        });
    });
});
