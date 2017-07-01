const express = require('express');
const router = express.Router();
const wcs = require('../helpers/wcs');

router.get('/', (req, res) => {
    res.sendFile('views/chat.html',{root: __dirname.replace('/routes','')});
});

router.post('/mensagem', (req, res) => {
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
