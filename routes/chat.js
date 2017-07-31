const express = require('express');
const router = express.Router();
const wcs = require('../helpers/wcs');

let context = {};

router.get('/', (req, res) => {
    res.sendFile('views/chat.html',{root: __dirname.replace('/routes','')});
});

router.get('/mensagem/:mensagem', (req, res) => {
    wcs.message({
        'texto' : req.params.mensagem,
        'contexto': context
    },(err,resposta) => {
        if (err) {
            console.error(err);
            res.send(err);
        }
        else {
            context = resposta.context;
            res.send(JSON.stringify([{'text': resposta.output.text[0]}]));
        }

    })    
});

router.post('/mensagem', (req, res) => {
    console.dir(req.body);
    wcs.message({
        'texto' : req.body.mensagem,
        'contexto': JSON.parse(req.body.context)
    },(err,resposta) => {
        if (err) {
            console.error(err);
            res.send(err);
        }
        else {
            res.send({ 'resposta': resposta.output.text[0] ,'context': resposta.context});
        }

    })    
});
module.exports = router;
