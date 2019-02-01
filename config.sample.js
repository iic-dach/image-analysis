var config = {
  watson: {
    visual_recognition: {
      url:'https://gateway.watsonplatform.net/visual-recognition/api',
      api_key: '<your Visual Recognition API key>',
      version: '2018-03-19'
    },
    text_to_speech: {
      url:'https://stream.watsonplatform.net/text-to-speech/api',
      api_key: '<your Text To Speech API key>'
    },
    language_translator: {
      url: 'https://gateway.watsonplatform.net/language-translator/api',
      api_key: '<your Language translator api key>',
      version: '2018-05-01'
    }
  }
};
module.exports = config;
