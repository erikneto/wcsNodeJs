const express = require('express');
const router = express.Router();
const watson = require('../helpers/watson');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, 'Audio.wav');
    }
});
var upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        cb(null, true);
    }
}).single('audio');

let context = {};

router.get('/', (req, res) => {
    res.sendFile('views/chat.html', { root: __dirname.replace('/routes', '') });
});

router.get('/mensagem/:mensagem', (req, res) => {
    watson.message({
        'texto': req.params.mensagem,
        'contexto': context
    }, (err, resposta) => {
        if (err) {
            console.error(err);
            res.send(err);
        }
        else {
            context = resposta.context;
            res.send(JSON.stringify([{ 'text': resposta.output.text[0] }]));
        }

    })
});

router.post('/mensagem', (req, res) => {

    watson.message({
        'texto': req.body.mensagem,
        'contexto': JSON.parse(req.body.context)
    }, (err, resposta) => {
        if (err) {
            console.error(err);
            res.send(err);
        }
        else {
            res.send({ 'resposta': resposta.output.text[0], 'context': resposta.context });
        }

    })
});

router.post('/audio', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            watson.transcribe('./uploads/Audio.wav', (err,result) => {
                res.status(200).send(JSON.stringify({"retorno": result}));
            })
        }
    })
});
module.exports = router;
