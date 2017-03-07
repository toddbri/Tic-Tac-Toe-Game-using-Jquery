var activegame = false;
var blankBoard = [null,null,null,null,null,null,null,null,null];
var symbolLookup = {1:"X",2:"O"};
var statusLookup = {1:"Player 1's turn (X)",2:"Player 2's turn (O)",3:"My turn (X)....thinking",4:"Your turn (O)"};
var currentMoves = blankBoard.slice();
var currentPlayer = 1;
var movesLeft = 9;
var ai=2;
var choice;
var found;

function start(){
  ai =0;
  movesLeft=9;
  currentMoves=blankBoard.slice();
  currentPlayer= (Math.random() > 0.5 ) ? 2 : 1;
  $('.cell').html("");
  $('.start').css('display','none');
  $('.status').html(statusLookup[currentPlayer]);
  $('.hr').css('display','none');
  $('.ai').css('display','none');


}

function aimode(){
  ai = 2;
  movesLeft=9;
  currentMoves = blankBoard.slice();
  currentPlayer = (Math.random() > 0.5 ) ? 1: 2;
  $('.cell').html("");
  $('.start').css('display','none');
  $('.status').html(statusLookup[ai+currentPlayer]);
  $('.hr').css('display','none');
  $('.ai').css('display','none');
  if (currentPlayer===1){ //computer
    $('.status').html(statusLookup[ai + currentPlayer]);
    computerTurn();
  } else {  //person
    $('.status').html("You go first (O)");

  }

}

function computerTurn(){
  found = false;
  if (currentMoves[4]===null){choice = 4;found = true;} //if the center box is open, take it.
  while (! found){
    choice = parseInt(Math.random()*9);
    if (currentMoves[choice]===null){found = true;}
  }
    currentMoves[choice]="X";
    $('.cell:nth-child(' + (choice + 1) + ')').html("X");
    processSelection();

}


function makeMove(){
  if ((currentPlayer===2 && ai==2) | ai===0){
      if (movesLeft>0){
        var cellnum = parseInt($(this).attr('id'));
        var symbol = symbolLookup[currentPlayer];
        if (currentMoves[cellnum]===null){
          $(this).html(symbol);
          currentMoves[cellnum]=symbol;
        }
    processSelection();

    }
    }
}

function processSelection(){
  winner = check4Winner();
  if (winner === null){                                               //no winner yet
    currentPlayer = (currentPlayer ===1) ? 2:1;                       //change to the next player
    $('.status').html(statusLookup[ai + currentPlayer]);              //update status message
    if (ai==2 && currentPlayer===1){setTimeout(computerTurn,2000);}  //trigger computers turn since this must be a user turn
    movesLeft -=1;
    }
  else { //someone won!
        movesLeft = 0;
        if (ai===2){ //this is single player mode
          if (currentPlayer===2){$('.status').html('You won....well played');}
          else {$('.status').html('I won!');}
        }

        else {//this is 2 player mode

          $('.status').html('Player ' + currentPlayer + ' is the winner');

        }
        $('.start').css('display','flex');
        $('.ai').css('display','flex');
      }
  // movesLeft -=1;

  if (movesLeft===0 && winner===null){
    $('.status').html("Game Over!...it's a draw");
    $('.start').css('display','flex');
      $('.ai').css('display','flex');
    }

}

$(function(){

  $('.gameboard').on('click','.cell',makeMove);
  $('.start').click(start);
  $('.ai').click(aimode);

});


function check4Winner(){
  // debugger;
// console.log(currentMoves);
  var winner = null;
  if (currentMoves[0]!==null && currentMoves[0]==currentMoves[1] && currentMoves[0]==currentMoves[2]){
    winner = currentMoves[0];
    $('#hr1').css('display','block');
  }
  if (currentMoves[0]!==null && currentMoves[0]==currentMoves[4] && currentMoves[0]==currentMoves[8]){
    winner = currentMoves[0];
    $('#hr4').css('display','block');
  }
  if (currentMoves[0]!==null && currentMoves[0]==currentMoves[3] && currentMoves[0]==currentMoves[6]){
    winner = currentMoves[0];
    $('#hr5').css('display','block');
  }

  if (currentMoves[3]!==null && currentMoves[3]==currentMoves[4] && currentMoves[3]==currentMoves[5]){
    winner = currentMoves[3];
    $('#hr2').css('display','block');
  }
  if (currentMoves[6]!==null && currentMoves[6]==currentMoves[7] && currentMoves[6]==currentMoves[8]){
    winner = currentMoves[6];
    $('#hr3').css('display','block');
  }
  if (currentMoves[1]!==null && currentMoves[1]==currentMoves[4] && currentMoves[1]==currentMoves[7]){
    winner = currentMoves[1];
    $('#hr7').css('display','block');
  }
  if (currentMoves[2]!==null && currentMoves[2]==currentMoves[5] && currentMoves[2]==currentMoves[8]){
    winner = currentMoves[2];
    $('#hr8').css('display','block');
  }
  if (currentMoves[2]!==null && currentMoves[2]==currentMoves[4] && currentMoves[2]==currentMoves[6]){
    winner = currentMoves[2];
      $('#hr6').css('display','block');
  }
  if (winner === null){
    return null;
  } else { return winner;}

}
