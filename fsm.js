const pss = require('./pss');

const STATE = {
  Idle: 0,
  Game: 1,
  Hello: 2,
  'Idle': 0,
  'Game': 1,
  'Hello': 2,
}

const GAME = {
  Waiting: 0,
  Result: 1,
  'Waiting': 0,
  'Result': 1,
}

const QUICKREPLIES = {
  game: [
    {
      content_type: 'text',
      title: '剪刀',
      payload: 'Game.Result.scissor'
    },
    {
      content_type: 'text',
      title: '石頭',
      payload: 'Game.Result.stone'
    },
    {
      content_type: 'text',
      title: '布',
      payload: 'Game.Result.paper'
    },
  ],
  idle: [
    {
      content_type: 'text',
      title: '猜拳',
      payload: 'Idle.Game.Waiting'
    },
  ]
}

function State(states, recipientId) {
  var _state = states.shift();
  switch(STATE[_state]) {
    case STATE.Idle:
      return State(states, recipientId);
    case STATE.Game:
      return game(states, recipientId);
    default:
      var msgTxt = _state;
      return msgGen(recipientId, msgTxt, QUICKREPLIES.idle)
  }
}

function msgGen(recipientId, msgTxt, quick_replies) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: msgTxt,
      quick_replies: quick_replies
    }
  };
}

function game(states, recipientId) {
  var _state = states.shift();
  switch(GAME[_state]) {
    case GAME.Waiting:
      return msgGen(recipientId, '請出拳！', QUICKREPLIES.game);
    case GAME.Result:
      var user_choose = pss.CHOOSE[states.shift()];
      return Result(user_choose, recipientId);
  }
}

function Result(user_choose, recipientId) {
  var results = pss.go(user_choose);
  var ai_choose = results.ai_choose;
  var result = results.result;
  console.log(user_choose);
  console.log(results);
  switch(result) {
    case pss.RESULT.Draw:
      return msgGen(recipientId, '電腦出'+pss.CHOOSESTR[ai_choose]+',Draw!', QUICKREPLIES.game);
    case pss.RESULT.Win:
      return msgGen(recipientId, '電腦出'+pss.CHOOSESTR[ai_choose]+',You win!', QUICKREPLIES.game);
    case pss.RESULT.Lose:
      return msgGen(recipientId, '電腦出'+pss.CHOOSESTR[ai_choose]+',You lose!', QUICKREPLIES.game);
  }
}

module.exports = {
  State: State
}
