const fs = require('fs');

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

const config = require('../config');

const visualRecognition = new VisualRecognitionV3({
  url: config.watson.visual_recognition.url,
  version: config.watson.visual_recognition.version,
  iam_apikey: config.watson.visual_recognition.api_key
});

const languageTranslator = new LanguageTranslatorV3({
  version: config.watson.language_translator.version,
  iam_apikey: config.watson.language_translator.api_key,
  url: config.watson.language_translator.url
});

const textToSpeech = new TextToSpeechV1({
  url: config.watson.text_to_speech.url,
  iam_apikey: config.watson.text_to_speech.api_key 
});

exports.recognize = function(req, res, next) {
  let params;
  if (!req.file) {
//    return next({ error: 'Missing required parameter: file', code: 400 }); 
    params = {
      url: req.body.imageUrl
    };
  } else {
    params = {
      images_file: fs.createReadStream(req.file.path)
    };
  }

  visualRecognition.classify(params, function(error, result) {
		// delete the recognized file
    if (req.file)
      fs.unlink(req.file.path, function(err) {
        if (err) {
          console.log('unlink failed', err);
        } else {
 //         console.log('file deleted!');
        }
      });

    if (error) {
      return next(error);
    }
    else {
      return res.json(result);
    }
  });
};

exports.translate = (req, res, next) => {
  var values = Object.keys(req.body).map(key => {
    return req.body[key];
  })
  console.log(values);
  var params = {
    text: values[0],
    model_id: 'en-de'
  };
  languageTranslator.translate(params, function(error, result) {
    if (error)
      return next(error);
    else
      return res.json(result);
  });
};

exports.speak = function(req, res, next) {
  var params = {
    text: req.body.text,
    voice: req.body.voice || 'en-US_MichaelVoice',
    accept: 'audio/wav'
  };
  
  textToSpeech.synthesize(params, function(err, result) {
    if (err) {
      return next(err);
    } else {
      res.end(result);
    }
  });
};
