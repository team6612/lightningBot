const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const fsm = require('./fsm')

const port = process.env.PORT || 9487;

app.use(bodyParser.json())

// For init auth
app.get('/', function (req, res) {
  res.send(req.query['hub.challenge'])
})

// Webhook
app.post('/', function(req, res) {
  var msging = req.body.entry[0].messaging[0];
  console.log(msging);
  var senderId = msging.sender.id;
  var recipientId = msging.recipient.id;
  var msg = msging.message;
  var msgTxt = msg.text;
  var messageData, states;

  if(msg.quick_reply) {
    var payload = msg.quick_reply.payload;
    states = payload.split('.');
  } else {
    states = ['Idle', msgTxt]
  }

  messageData = fsm.State(states, senderId);

  reply(messageData);
  res.sendStatus(200);
})

function reply(messageData) {
  console.log(messageData);
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: 'EAABZCA2YFq2wBAM3fNaZAAQKzUzqsSes17QdBvLfqcSDASZCWoXukRSrd6SBktihfGEUQEiwblFa1wV7Bzse7P6yJ5yrm770ZCqe7xejYKt9o3Pgy6oYM36wnYc5RLAJmzxeyAuiAEeTBli0uAvkERK61Fy5vqMoOJy7rWINbFKj6FKoJoN3'
    },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      // console.error("Unable to send message.");
      // console.error(response);
      // console.error(error);
    }
  })
}

function toChinese(choose) {
  switch (choose) {
    case 'paper':
      return '布'
    case 'scissor':
      return '剪刀'
    case 'stone':
      return '石頭'
  }
}

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})
