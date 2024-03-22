$('.Dall-E').show()
$('.Stable-Diffusion').hide()
$('#DallSubmit').show()
$('.spin-loader').hide()

function dalle(){
    $('.Dall-E').show()
    $('.Stable-Diffusion').hide()
    // Clear previous image cards
    $('#imageCardsContainer').empty();
    $('#dalle-input').val('');
}

function stable(){
    $('.Dall-E').hide()
    $('.Stable-Diffusion').show()
    $('#StableSubmit').show()
    $('.spin-loader').hide()
    // Clear previous image cards
    $('#imageCardsContainer').empty();
    $('#stable-input').val('');

}

$(document).ready(function() {
    // Handle form submission
    $('#DallSubmit').show();
    $('#StableSubmit').hide();
    $('.spin-loader').hide();

    function DallForm() {
        var textInput = $('input[name="dallename"]').val(); // Get text input value   
        if (!textInput) {
            alert('Please enter something.');
            return; // Stop form submission if input is empty
        }
        $('.spin-loader').show();
        $('#DallSubmit').hide();

        

        // Prepare data object
        var formData = {
            text: textInput,
        };
        console.log(formData)

        // Show loading message
        $('#loadingMessage').show();

        // Clear previous image cards
        $('#imageCardsContainer').empty();

        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: 'https://image-generator-api-5h7w.onrender.com/dalle_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                // Handle success response
                console.log('####################');
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#DallSubmit').show();

                if (typeof response == 'string') {
                    console.log('not a list :', response);
                    var cardHtml = '<div class="col-sm-12">' +
                        '<div class="card px-3 text-dark font-weight-normal">' +
                        '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response + '</h5>' +
                        '</div>' +
                        '</div>';
                    $('#imageCardsContainer').append(cardHtml);
                } else {
                    // Create image cards for each URL in the response
                    response.forEach(function(image, index) {
                        console.log('list:', image);
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
            },
            error: function(xhr, status, error) {
                // Handle error response
                var errorMessage;
                if (xhr.status === 403) {
                    // Handle Bing blocking the prompt
                    errorMessage = "Blocked the prompt. Please revise it and try again.";
                } else {
                    // Handle other errors (e.g., internal server error)
                    errorMessage = "Internal Server Error";
                }
                // Hide loading message
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#DallSubmit').show();
                var cardHtml = '<div class="col-sm-12">' +
                    '<div class="card px-3 text-dark font-weight-normal">' +
                    '<h5 style="font-weight:400 !important;font-size:1rem !important">' + errorMessage + '</h5>' +
                    '</div>' +
                    '</div>';
                $('#imageCardsContainer').append(cardHtml);
            }
        });
    };

    function StableForm() {
        var textInput = $('input[name="stablename"]').val(); // Get text input value  
        var styleInput = $('#style').val(); // Get text input value 
        console.log(styleInput) 
        if (!textInput) {
            alert('Please enter something.');
            return; // Stop form submission if input is empty
        } 
        $('.spin-loader').show();
        $('#StableSubmit').hide();

        // Prepare data object
        var formData = {
            text: textInput,
            style: styleInput
        };
        console.log(formData)

        // Show loading message
        $('#loadingMessage').show();

        // Clear previous image cards
        $('#imageCardsContainer').empty();

        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: 'https://image-generator-api-5h7w.onrender.com/stable_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                // Handle success response
                console.log('####################');
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#StableSubmit').show();

                if (typeof response == 'string') {
                    console.log('not a list :', response);
                    var cardHtml = '<div class="col-sm-12">' +
                        '<div class="card px-3 text-dark font-weight-normal">' +
                        '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response + '</h5>' +
                        '</div>' +
                        '</div>';
                    $('#imageCardsContainer').append(cardHtml);
                } else {
                    // Create image cards for each URL in the response
                    response.forEach(function(image, index) {
                        console.log('list:', image);
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
            },
            error: function(xhr, status, error) {
                // Handle error response
                var errorMessage;
                if (xhr.status === 403) {
                    // Handle Bing blocking the prompt
                    errorMessage = "Blocked the prompt. Please revise it and try again.";
                } else {
                    // Handle other errors (e.g., internal server error)
                    errorMessage = "Internal Server Error";
                }
                // Hide loading message
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#StableSubmit').show();
                var cardHtml = '<div class="col-sm-12">' +
                    '<div class="card px-3 text-dark font-weight-normal">' +
                    '<h5 style="font-weight:400 !important;font-size:1rem !important">' + errorMessage + '</h5>' +
                    '</div>' +
                    '</div>';
                $('#imageCardsContainer').append(cardHtml);
            }
        });
    };

    $('#DallSubmit').click(function(event) {
        event.preventDefault();
        DallForm();
    });
    $('#StableSubmit').click(function(event) {
        event.preventDefault();
        StableForm();
    });

    $('input').keypress(function(event) {
        if (event.which == 13) { // Check if Enter key is pressed
            event.preventDefault();
            if ($('.Dall-E').is(":visible")) {
                DallForm();
            } else if ($('.Stable-Diffusion').is(":visible")) {
                StableForm();
            }
        }
    });
});

