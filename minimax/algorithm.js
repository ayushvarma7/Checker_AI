function minimax(position, depth, maxPlayer, game) {
  if (depth == 0 || (position.winner() != null && position.winner() != undefined)) {
    return [position.difference(), position]
    // return {eval: position.difference(), pos: position};
  }
  if (maxPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    let allMoves = getAllMoves(position, LightColor, game);
    for (let m = 0; m < allMoves.length; m++) {
      let place = allMoves[m];
      let evaluation = minimax(place, depth-1, false, game)[0];
      maxEval = Math.max(maxEval, evaluation);
      if (maxEval == evaluation) {
        bestMove = place;
      }
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    let bestMove = null;
    let allMoves = getAllMoves(position, DarkColor, game);
    for (let m = 0; m < allMoves.length; m++) {
      let place = allMoves[m];
      let evaluation = minimax(place, depth-1, true, game)[0];
      minEval = Math.min(minEval, evaluation);
      if (minEval == evaluation) {
        bestMove = place;
      }
    }
    return [minEval, bestMove];
  }
}
function simulateMove(pawn, place, Game_board, game, skip) {
  Game_board.place(pawn, place[0], place[1]);
  if (skip.length > 0) {
      Game_board.remove(skip);
  }
  return Game_board;
}

function getAllMoves(Game_board, color, game) {
  let moves = [];
  let allPieces = Game_board.getAllPieces(color);
  for (let p = 0; p < allPieces.length; p++) {
    let pawn = allPieces[p];
    let validMoves = Game_board.getForcedValidMoves(pawn, color);
    for (var m = 0; m < validMoves.length; m++) {
      let place = validMoves[m].m;
      let skip = validMoves[m].j;
      // console.log(skip);
      let tempBoard = copyBoard();
      let tempPiece = tempBoard.Game_board[pawn.r][pawn.columns];//getPawn(pawn.r, pawn.columns);
      let newBoard = simulateMove(tempPiece, place, tempBoard, game, skip);
      moves.push(newBoard);
    }
  }
  return moves;
}

function copyBoard() {
  var Game_board = new ChechersBoard();
  Game_board.Game_board = _.cloneDeep(game.Game_board.Game_board);
  // Game_board.Game_board = JSON.parse(JSON.stringify(game.Game_board.Game_board));
  Game_board.Left_of_black_pawn = game.Game_board.Left_of_black_pawn;
  Game_board.LightColorLeft = game.Game_board.LightColorLeft;
  Game_board.King_of_blacks = game.Game_board.King_of_blacks;
  Game_board.LightColorKings = game.Game_board.LightColorKings;
  // console.log(Game_board.Game_board[1][2]).hello();
  return Game_board;
}

function copyPiece(r, columns, color, Game_board) {
  var pawn = new Piece(r, columns, color);
  pawn.king = Game_board.Game_board[r][columns];
  return pawn;
}