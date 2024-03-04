/// Ajax Form Submission
$(document).ready(function() {
    // Handle form submission
    $('#submitButton').click(function() {
        var textInput = $('input[name="fname"]').val(); // Get text input value
        var imageCount = $('#count').val(); // Get dropdown input value
        var imagesize = $('#size').val(); // Get dropdown input value

        // Prepare data object
        var formData = {
            text: textInput,
            count: imageCount,
            size : imagesize
        };

        // Clear previous image cards
        $('#imageCardsContainer').empty();

        // Show loading message
        $('#loadingMessage').show();

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

                // check if user enter input or not
                if (response=='Please Enter something') {
                       var cardHtml = '<div class="col-sm-12">' +
                    '<div class="card px-3 text-dark font-weight-normal">' +
                    '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response + '</h5>' +
                    '</div>' +
                    '</div>';
                     $('#imageCardsContainer').append(cardHtml);
                }
                else{// Create image cards for each URL in the response
                    response.forEach(function(url, index) {
                        var cardHtml = '<div class="col-sm-3">' +
                            '<div class="card">' +
                            '<img src="data:image/png;base64,' + url + '" class="card-img-top" alt="...">' +
                            '<div class="card-body">' +
                            '<a href="data:image/png;base64,' + url + '" download="' + index + '.png"><button class="btn btn-primary download-btn">Download</button></a>' +
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
                // Clear previous image cards
                $('#imageCardsContainer').empty();

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

