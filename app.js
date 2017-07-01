const express = require('express')
const path = require('path');
const app = express()
const chatRouter = require('./routes/chat')
const bodyParser = require('body-parser')


const serverPort = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/chat',chatRouter)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.redirect('/chat')
})

app.listen(serverPort, function () {
  console.log('Example app listening on port %d!',serverPort)
})
