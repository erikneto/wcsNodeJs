const vcap = require('../util/vcapService');
const watson = require('watson-developer-cloud');
const db = require('./db');

exports.message = (mensagem, callback) => {
    let watsonConfig = vcap.conversation[0].credentials;
    watsonConfig.version = 'v1';
    watsonConfig.version_date = '2017-05-26';

    const conversation = watson.conversation( watsonConfig );
    conversation.message({
        workspace_id: 'f716bbef-d7c8-4563-b5ef-9c0f008eb71f',
        input: { 'text': mensagem.texto },
        context: mensagem.contexto
    }, function (err, response) {
        if (err) {
            callback(err,null);
        }
        else {
            db.logar(response);
            callback(null,response);
        }
    });
}
