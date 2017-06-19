const express = require('express');
const vcap = require('../util/vcapService');
const router = express.Router();
const watson = require('watson-developer-cloud');

router.get('/', (req, res) => {
    res.sendFile('views/chat.html',{root: __dirname.replace('/routes','')});
});

router.post('/mensagem', (req, res) => {
    let watsonConfig = vcap.conversation[0].credentials;
    watsonConfig.version = 'v1';
    watsonConfig.version_date = '2017-05-26';

    const conversation = watson.conversation( watsonConfig );

    conversation.message({
        workspace_id: 'f716bbef-d7c8-4563-b5ef-9c0f008eb71f',
        input: { 'text': req.body.mensagem },
        context: JSON.parse(req.body.context)
    }, function (err, response) {
        if (err) {
            console.error(err);
            res.send(err);
        }
        else {
            res.send({ 'resposta': response.output.text[0] ,'context': response.context});
        }
    });

});
module.exports = router;
