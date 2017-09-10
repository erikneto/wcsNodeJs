const vcap = require('../util/vcapService');
const watson = require('watson-developer-cloud');
const db = require('./db');
const fs = require('fs');

exports.message = (mensagem, callback) => {
    let watsonConfig = vcap.conversation[0].credentials;
    watsonConfig.version = 'v1';
    watsonConfig.version_date = '2017-05-26';

    const conversation = watson.conversation(watsonConfig);
    conversation.message({
        workspace_id: 'f716bbef-d7c8-4563-b5ef-9c0f008eb71f',
        input: { 'text': mensagem.texto },
        context: mensagem.contexto
    }, function (err, response) {
        console.dir(response);
        if (err) {
            callback(err, null);
        }
        else {
            db.logar(response);
            callback(null, response);
        }
    });
}

exports.transcribe = (arquivo, callback) => {
    var speech_to_text = new watson.SpeechToTextV1({
        username: '3e63e522-4644-4bac-bdb1-e563312fb9e0',
        password: 'cm0pnKYaHfe4'
    });

    var params = {
        audio: fs.createReadStream(arquivo),
        content_type: 'audio/wav',
        model: 'pt-BR_BroadbandModel'
    };

    speech_to_text.recognize(params, function (error, transcript) {

        if (error || transcript.results.length === 0)
            callback(error, null);
        else
            callback(null, transcript.results[0].alternatives[0].transcript);
    });
}