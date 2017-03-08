var blankBoard = [0,0,0,0,0,0,0,0,0]; //player 1 = 1 , player 2 = -1
var symbolLookup = {1:"X",2:"O"};
var statusLookup = {1:"Player 1's turn (X)",2:"Player 2's turn (O)",3:"My turn (X), thinking",4:"Your turn (O)"};
var currentMoves = blankBoard.slice();
var possibilities = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var currentPlayer;
var movesLeft = 9;
var ai;
var choice;
var found;
var timer;

function setUp(){
  movesLeft=9;
  currentMoves=blankBoard.slice();
  currentPlayer= (Math.random() > 0.5 ) ? 2 : 1;
  currentPlayer = 2;
  $('.cell').html("");
  $('.start').css('display','none');
  $('.status').css('display','block');
  $('.status').html(statusLookup[ai + currentPlayer]);
  $('.hr').css('display','none');
  console.clear();
  console.log("******************");
}

function start(){
  ai =0;
  setUp();
}

function ticking(){
  // console.log("ticking");
  if (currentPlayer===1){

  $('.status').html($('.status').html()+ ".");
  }
}

function aimode(){
  ai = 2;
  setUp();
  // console.log("cp: " + currentPlayer);
  if (currentPlayer===1){$('.status').html(statusLookup[ai + currentPlayer]);computerTurn();}
  else {$('.status').html("You go first (O)");}

}

function computerTurn(){
  choice = chooser();
  currentMoves[choice]=1;
  $('.cell:nth-child(' + (choice + 1) + ')').html("X");
  processSelection();
}

function chooser(){
    var taken = movesCount();
    console.log("in chooser:");
    console.log("taken: " + taken + " , currentMoves: " + currentMoves);
    if ((taken === 0 | taken ===1) && currentMoves[4]===0){return 4;} //if this is 1st or the second move and center cell is open, take it.
    if (taken ===1 && currentMoves[4]===-1){return 0;}
    if (taken===2){return thirdMove();}

    sundry = canIWin(); //check to see if I have a winning move
    if (sundry >= 0){return sundry;}

    sundry = canILose();  //check to see if other player has a winning move
    if (sundry >=0 ){return sundry;}
    if (taken===3){return fourthMove();}

    return chooseSomething();
}
function movesCount(){
  return currentMoves.reduce(function(accum,element){return accum + (element ===0? 0:1);},0);

}
function canIWin(){
  console.log("starting can I win");
    for (var j in possibilities){
      var lineSum = possibilities[j].reduce(function(accum,element){return accum + currentMoves[element];},0);
      console.log("line: " + lineSum + " for " + possibilities[j]);
      if (lineSum >1){
        for (var x in possibilities[j]){
          if (currentMoves[possibilities[j][x]]===0){return possibilities[j][x];};
        }
      }
    }
    return -1;
}
function canILose(){
    for (var j in possibilities){
      var lineSum = possibilities[j].reduce(function(accum,element){return accum + currentMoves[element];},0);
      if (lineSum <-1){
        for (var x in possibilities[j]){
          if (currentMoves[possibilities[j][x]]===0){return possibilities[j][x];};
        }
      }
    }
    return -1;
}

function thirdMove(){
  console.log("third move");
  if (currentMoves[0]===-1){return 3;}
  if (currentMoves[1]===-1){return 0;}
  if (currentMoves[2]===-1){return 1;}
  if (currentMoves[3]===-1){return 0;}
  if (currentMoves[5]===-1){return 8;}
  if (currentMoves[6]===-1){return 7;}
  if (currentMoves[7]===-1){return 8;}
  return 5;

}
function fourthMove(){
  if (currentMoves[4]===1){
    if (currentMoves[0]===-1 && currentMoves[8]===-1){return 5;}
    if (currentMoves[2]===-1 && currentMoves[6]===-1){return 5;}
    if (currentMoves[1]===-1 && currentMoves[7]===-1){return 5;}
    if (currentMoves[3]===-1 && currentMoves[5]===-1){return 1;}
    if (currentMoves[1]===-1 && currentMoves[5]===-1){return 2;}
    if (currentMoves[1]===-1 && currentMoves[3]===-1){return 0;}
    if (currentMoves[3]===-1 && currentMoves[7]===-1){return 6;}
    if (currentMoves[5]===-1 && currentMoves[7]===-1){return 8;}
  }
  if (currentMoves[0]===1 && currentMoves[4]===-1 && currentMoves[8]===-1){return 6;}
  console.log("I wasn't expecting this scenario");
  return -1;

}

function chooseSomething(){
  console.log(currentMoves);
  var leftovers = currentMoves.map(function(element,index){return element === 0?index:-1;});
  console.log("1: " + leftovers);
  leftovers = leftovers.filter(function(element,index){return (element !=-1);});
  console.log("2: " + leftovers);
  var choice = leftovers[parseInt(Math.random()*leftovers.length)];
  console.log("choosing: " + choice);
  return choice;
}

function makeMove(){
  if ((currentPlayer===2 && ai==2) | ai===0){
      if (movesLeft>0){
        var cellnum = parseInt($(this).attr('id'));
        var symbol = symbolLookup[currentPlayer];
        if (currentMoves[cellnum]===0){
          $(this).html(symbol);
          currentMoves[cellnum]= (symbol ==="X"? 1:-1);
        }
    processSelection();

    }
    }
}

function processSelection(){
  winner = check4Winner();
  if (winner === 0){                                               //no winner yet
    movesLeft -=1;
    currentPlayer = (currentPlayer ===1) ? 2:1;                       //change to the next player
    $('.status').html(statusLookup[ai + currentPlayer]);              //update status message
    if (ai==2 && currentPlayer===1 && movesLeft>0){setTimeout(computerTurn,500);}  //trigger computers turn since this must be a user turn

  } else { //someone won!
    movesLeft = 0;
    if (ai===2){ //this is single player mode
      if (currentPlayer===2){$('.status').html('You won....well played');}
      else {$('.status').html('I won!');}
    }

    else {//this is 2 player mode

      $('.status').html('Player ' + currentPlayer + ' is the winner');

    }
    enableNewGame();

  }


  if (movesLeft===0 && winner===0){
    $('.status').html("Game Over!...it's a draw");
    enableNewGame();

  }

}

$(function(){

  $('.gameboard').on('click','.cell',makeMove);
  $('.right').click(start);
  $('.left').click(aimode);

});

function enableNewGame (){
  $('.start').css('display','block');
}

function check4Winner(){

  var winner = 0;
  if (currentMoves[0]!==0 && currentMoves[0]==currentMoves[1] && currentMoves[0]==currentMoves[2]){
    winner = currentMoves[0];
    $('#hr1').css('display','block');
  }
  if (currentMoves[0]!==0 && currentMoves[0]==currentMoves[4] && currentMoves[0]==currentMoves[8]){
    winner = currentMoves[0];
    $('#hr4').css('display','block');
  }
  if (currentMoves[0]!==0 && currentMoves[0]==currentMoves[3] && currentMoves[0]==currentMoves[6]){
    winner = currentMoves[0];
    $('#hr5').css('display','block');
  }

  if (currentMoves[3]!==0 && currentMoves[3]==currentMoves[4] && currentMoves[3]==currentMoves[5]){
    winner = currentMoves[3];
    $('#hr2').css('display','block');
  }
  if (currentMoves[6]!==0 && currentMoves[6]==currentMoves[7] && currentMoves[6]==currentMoves[8]){
    winner = currentMoves[6];
    $('#hr3').css('display','block');
  }
  if (currentMoves[1]!==0 && currentMoves[1]==currentMoves[4] && currentMoves[1]==currentMoves[7]){
    winner = currentMoves[1];
    $('#hr7').css('display','block');
  }
  if (currentMoves[2]!==0 && currentMoves[2]==currentMoves[5] && currentMoves[2]==currentMoves[8]){
    winner = currentMoves[2];
    $('#hr8').css('display','block');
  }
  if (currentMoves[2]!==0 && currentMoves[2]==currentMoves[4] && currentMoves[2]==currentMoves[6]){
    winner = currentMoves[2];
      $('#hr6').css('display','block');
  }
  if (winner === 0){
    return 0;
  } else { return winner;}

}
