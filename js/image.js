let conversationHistory = [];

function addToConversation(prompt, imageUrl, model) {
    conversationHistory.push({ prompt, imageUrl, model });
    updateConversationDisplay();
}

function updateConversationDisplay() {
    const container = $('#conversationContainer');
    container.empty();

    conversationHistory.forEach((item, index) => {
        // var messageHtml = '<div class="col-sm-3">' +
        //                     '<div class="card">' +
        //                     '<img src="data:image/png;base64,' + item.imageUrl + '" class="card-img-top" alt="...">' +
        //                     '<div class="card-body">' +
        //                     '<a href="data:image/png;base64,' + item.imageUrl + '" download="' + index + '.png"><button class="btn btn-primary download-btn">Download</button></a>' +
        //                     '</div>' +
        //                     '</div>' +
        //                     '</div>';
        const messageHtml = `
            <div class="conversation-message">
                <p><strong>${item.model} Prompt ${index + 1}:</strong> ${item.prompt}</p>
                <img src="data:image/png;base64,${item.imageUrl}" alt="Generated image ${index + 1}" class="generated-image">
                <a href="data:image/png;base64,${item.imageUrl}" download="${index}.png">
                    <button class="btn btn-primary download-btn mt-2">Download</button>
                </a>
            </div>
        `;
        container.append(messageHtml);
    });
}

function clearConversation() {
    conversationHistory = [];
    updateConversationDisplay();
}

$('.Dall-E').show();
$('.Stable-Diffusion').hide();
$('#DallSubmit').show();
$('.spin-loader').hide();

function dalle(){
    $('.Dall-E').show();
    $('.Stable-Diffusion').hide();
    $('#dalle-input').val('');
    clearConversation();
}

function stable(){
    $('.Dall-E').hide();
    $('.Stable-Diffusion').show();
    $('#StableSubmit').show();
    $('.spin-loader').hide();
    $('#stable-input').val('');
    clearConversation();
}

$(document).ready(function() {
    $('#DallSubmit').show();
    $('#StableSubmit').hide();
    $('.spin-loader').hide();

    function DallForm() {
        var textInput = $('input[name="dallename"]').val();
        if (!textInput) {
            alert('Please enter something.');
            return;
        }
        $('.spin-loader').show();
        $('#DallSubmit').hide();

        var formData = {
            text: textInput,
        };
        console.log(formData);

        $('#loadingMessage').show();

        $.ajax({
            type: 'POST',
            url: 'https://image-generator-api-5h7w.onrender.com/dalle_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#DallSubmit').show();

                if (typeof response == 'string') {
                    addToConversation(textInput, '', 'DALL-E');
                } else {
                    response.forEach(function(image) {
                        addToConversation(textInput, image, 'DALL-E');
                    });
                }
            },
            error: function(xhr, status, error) {
                var errorMessage = xhr.status === 403 ? "Blocked the prompt. Please revise it and try again." : "Internal Server Error";
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#DallSubmit').show();
                addToConversation(textInput, '', 'DALL-E (Error)');
            }
        });
    };

    function StableForm() {
        var textInput = $('input[name="stablename"]').val();
        var styleInput = $('#style').val();
        console.log(styleInput);
        if (!textInput) {
            alert('Please enter something.');
            return;
        } 
        $('.spin-loader').show();
        $('#StableSubmit').hide();

        var formData = {
            text: textInput,
            style: styleInput
        };
        console.log(formData);

        $('#loadingMessage').show();

        $.ajax({
            type: 'POST',
            url: 'https://image-generator-api-5h7w.onrender.com/stable_generator',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#StableSubmit').show();

                if (typeof response == 'string') {
                    addToConversation(textInput, '', 'Stable Diffusion');
                } else {
                    response.forEach(function(image) {
                        addToConversation(textInput, image, 'Stable Diffusion');
                    });
                }
            },
            error: function(xhr, status, error) {
                var errorMessage = xhr.status === 403 ? "Blocked the prompt. Please revise it and try again." : "Internal Server Error";
                $('#loadingMessage').hide();
                $('.spin-loader').hide();
                $('#StableSubmit').show();
                addToConversation(textInput, '', 'Stable Diffusion (Error)');
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
        if (event.which == 13) {
            event.preventDefault();
            if ($('.Dall-E').is(":visible")) {
                DallForm();
            } else if ($('.Stable-Diffusion').is(":visible")) {
                StableForm();
            }
        }
    });
});
