function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      var image = $('.file-upload-image').attr('src', e.target.result);
      // console.log(image)
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
  });
  $('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});


function sendImage() {
  var fileInput = document.querySelector('.file-upload-input');
  var image = fileInput.files[0];

  // Check if a file is selected
  if (!image) {
      console.error('No image selected');
      return;
  }

  var formData = new FormData();
  formData.append('file', image);
  formData.forEach(function(value, key){
    console.log(key, value);
  });

  $('#imageCardsContainer').empty()
  // Send AJAX request
  $.ajax({
      type: 'POST',
      url: 'https://image-generator-api-myfirstimagepush-1.onrender.com/extractor/',
      processData: false, // Prevent jQuery from automatically processing data
      contentType: false, // Prevent jQuery from automatically setting contentType
      data: formData,
      success: function(response) {
          // Handle success response
          console.log('Data submitted successfully:', response);
          var cardHtml = '<div class="col-sm-12">' +
                  '<div class="card px-3 text-dark font-weight-normal">' +
                  '<h5 style="font-weight:400 !important;font-size:1rem !important">' + response + '</h5>' +
                  '</div>' +
                  '</div>';
          $('#imageCardsContainer').append(cardHtml);
      },
      error: function(xhr, status, error) {
          // Handle error
          console.error('Error submitting data:', error);
          $('#loadingMessage').hide();
          alert('Error: ' + error);
      }
  });
}
