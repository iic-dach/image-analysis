'use strict';

$( document ).ready(function() {

  // Determine the base URI
  var baseURI = location.href;
  var hash = location.hash;
  if (hash && hash.length > 0) {
    baseURI = baseURI.substring(0, baseURI.lastIndexOf(hash));
  }
  if (baseURI.lastIndexOf('/') !== baseURI.length - 1) {
    baseURI += '/';
  }

  var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#FFF', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };
  var spinner = new Spinner(opts);
  var player = $.AudioPlayer();

  var options = {
    beforeSubmit: showRequest,  // pre-submit callback
    success: visualResult,  // post-submit callback
    error: visualError
  };

// bind to the form's submit event
  $('#frmUploader').submit(function () {
    $(this).ajaxSubmit(options);
    // always return false to prevent standard browser submit and page navigation
    return false;
  });

  function imageSelected(event) {
  //  clear();

    var target = event.target ? event.target : {};
    var files = target.files ? target.files : [];

    if ((files.length === 1) && (files[0].type.indexOf('image/') === 0)) {
      var img = $(new Image()).attr('src', URL.createObjectURL(files[0]));
      $('#image-container').append(img);
      $('#url-field').toggle();
      $('#btnSubmit').toggle();
      $('#reload').toggle();
      $('#picture-field').toggle();
    }
  }

  function urlChanged(event) {
    var target = event.target.value ? event.target.value : "";
    console.log(target);
    if (isUrlValid(target)) {
      console.log('valid');
 //     $('#picture-field').attr('disabled', 'disabled');
      $('#picture-field').toggle();
      $('#image-container').append('<img src="'+target+'"/>');
      $('#url-field').toggle();
      $('#btnSubmit').toggle();
      $('#reload').toggle();
    } else {
      console.log('invalid');
      $('#result-container').html('<h2>Invalid Url!</h2>');
      $('#reload').toggle();
    }
  }

  function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

  function spin() {
    setTimeout(function() {
      spinner.spin($('#image-container')[0]);
    }, 10);
  }

 // $('#btnSubmit').on('click', spin);

  $('#picture-field').on('change', imageSelected);
  $('#url-field').on('change', urlChanged)

  $('#reload').click(function () {
    window.location.replace('/');
  });

  // pre-submit callback
  function showRequest() {
    // alert('Uploading is starting.');
    spin();
    return true;
  }

  // post-submit callback
  function visualResult(responseText, statusText, xhr, $form) {
    // alert('status: ' + statusText + '\n\nresponseText: \n' + JSON.stringify(responseText));
    var detectedClasses = [];
    var classScores = [];
    // var classifier = responseText.images[0].classifiers[0].classifier_id;
    for (var i = 0; i < responseText.images[0].classifiers[0].classes.length; i++) {
      detectedClasses.push(responseText.images[0].classifiers[0].classes[i].class);
      classScores.push(responseText.images[0].classifiers[0].classes[i].score);
    }
    $('#btnSubmit').toggle();
    translate(detectedClasses, classScores);
  }

  function visualError(responseText, statusText, xhr, $form) {
    console.log(responseText);
    spinner.stop();
    $('#btnSubmit').toggle();
    try {
      const error = JSON.parse(responseText.responseJSON.error);
      $('#result-container').text(error.images[0].error.description);
    } catch(err) {
      $('#result-container').text(responseText.responseJSON.error);
    }
  }

  // translate all the recognized classes
  function translate(textObj, classScores) {
    var request = $.ajax({
      url: baseURI + 'translate',
      type: 'POST',
      data: {'text': textObj}
    });
    $.when(request).then(function(translateObj) {
      onSuccess(textObj, classScores, translateObj);
    }, function() {
      onSuccess(textObj, classScores);
    });
  }

  // Text-to-speech of selected Text
  function speak(detectedClass, translatedClass) {
//    var buffer = player.getSound();
    var buffer = null;
    var text = '';
    if (buffer !== null) {
      player.play();
    } else {
      var voice = null;
      if (translatedClass != null || translatedClass != '') {
        text = translatedClass;
        voice = 'de-DE_BirgitVoice';
      } else {
        text = detectedClass;
        voice = 'en-US_MichaelVoice';
      }
      if (text && text.length > 0) {
        var request = $.api.speak(text, voice);
        spin();
        $.when(request).done(function(sound) {
          spinner.stop();           
          player.setSound(sound);
        });
      }
    }
  }

  function onSuccess(textObj, classScores, translateObj) {
    var arrTranslate = [];
    for (var i = 0; i < translateObj.translations.length; i++) {
      arrTranslate.push(translateObj.translations[i].translation);
    }
    $('#table').append('<thead class="theader"><tr><td>Detected Class</td><td>Translated Class</td><td>Confidence</td></tr></thead><tbody>');
    for (i = 0; i < textObj.length; i++) {
      var indx = i;
      $('#table')
        .append('<tr id="'+indx+'" class="dataitem">'+'<td>'+textObj[i]+'</td><td>'+arrTranslate[i]+'</td><td>'+classScores[i]+'</td><td><img src="images/speaker.png" height="16" width="16"></td></tr>');
    }
    $('#table').append('</tbody>');
    spinner.stop();

    $('#table tbody tr').on('click', function(event) { 
      // alert(event.currentTarget.cells[1].innerText +' '+event.currentTarget.cells[0].innerText);
      var el = document.getElementById('image-container'); 
      var spinner = new Spinner(opts).spin(el);
      speak(event.currentTarget.cells[0].innerText,event.currentTarget.cells[1].innerText);
      spinner.stop();
    });
  }
/*  
  function onError() {
    spinner.stop();
  } */

});