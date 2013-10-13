// text to speech
$('#sayIt').click(function(e){
    var txtVal = $('#txt').val()
    console.log(txtVal);
    $.ajax({
      url: '/say',
      data: {text: txtVal}
    }).done(function(msg) {
      console.log(msg);
    }).fail(function(err) {
      console.log(err);
    })
    e.preventDefault();
  })
 
  // speech to text
  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;
  var SpeechRecognition = window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition || window.webkitSpeechRecognition || window.SpeechRecognition;
  if ( SpeechRecognition != undefined ) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.onstart = function() {
      recognizing = true;
    };
  
    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        console.log('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        console.log('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          console.log('info_blocked');
        } else {
          console.log('info_denied');
        }
        ignore_onend = true;
      }
    };
  
    recognition.onend = function() {
      recognizing = false;
      recognition.start();
      if (ignore_onend) {
        return;
      }
      if (!final_transcript) {
        console.log('info_start');
        return;
      }
      console.log('end');
      
    };
  
    recognition.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
    };
  }else{
    console.log('no support')
  }
  
  
  var two_line = /\n\n/g;
  var one_line = /\n/g;
  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }
  
  var first_char = /\S/;
  function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }
  
  final_transcript = '';
  recognition.lang = 6;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_timestamp = (new Date).getTime();