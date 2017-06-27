const CHOOSESTR = ['布', '剪刀', '石頭'];
const CHOOSE = {
  paper: 0,
  scissor: 1,
  stone: 2,
  'paper': 0,
  'scissor': 1,
  'stone': 2,
}
const RESULT = {
  Draw: 0,
  Win: 1,
  Lose: 2,
}

function go(user_choose) {
  var ai_choose = Math.floor(Math.random()*3);
  var result = RESULT.Draw;

  if(ai_choose != user_choose) {
    if( (user_choose > 0 && user_choose > ai_choose) || (user_choose == 0 && ai_choose == 2) ) result = RESULT.Win;
    else result = RESULT.Lose;
  }

  return {ai_choose: ai_choose, result: result};
}


module.exports = {
  CHOOSESTR: CHOOSESTR,
  CHOOSE: CHOOSE,
  RESULT: RESULT,
  go: go
}
