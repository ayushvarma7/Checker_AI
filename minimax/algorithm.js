function minimax(position, depth, maxPlayer) {
  if (depth == 0 || (position.winner() != null && position.winner() != undefined)) {
    return [position.evaluate(), position]
  }

  if (maxPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    let allMoves = getAllMoves(position, LightColor);
    for (let m = 0; m < allMoves.length; m++) {
      let move = allMoves[m];
      let evaluation = minimax(move, depth - 1, false)[0];
      maxEval = Math.max(maxEval, evaluation);
      if (maxEval == evaluation) {
        bestMove = place;
      }
    }
    console.log(game);
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    let bestMove = null;
    let allMoves = getAllMoves(position, DarkColor);
    for (let m = 0; m < allMoves.length; m++) {
      let move = allMoves[m];
      let evaluation = minimax(move, depth - 1, true)[0];
      minEval = Math.min(minEval, evaluation);
      if (minEval == evaluation) {
        bestMove = place;
      }
    }
    return [minEval, bestMove];
  }
}

function randomMove(position) {
  let allMoves = getAllMoves(position, LightColor);
  let move = Math.floor(Math.random() * allMoves.length);
  return allMoves[move];
}

function simulateMove(piece, move, board, skip) {
  board.move(piece, move[0], move[1]);
  if (skip.length > 0) {
    board.remove(skip);
  }
  return Game_board;
}

function getAllMoves(board, color) {
  let moves = [];
  let allPieces = Game_board.getAllPieces(color);
  for (let p = 0; p < allPieces.length; p++) {
    let pawn = allPieces[p];
    let validMoves = Game_board.getForcedValidMoves(pawn, color);
    for (var m = 0; m < validMoves.length; m++) {
      let place = validMoves[m].m;
      let skip = validMoves[m].j;
      let tempBoard = copyBoard();
      let tempPiece = tempBoard.board[piece.row][piece.col];//getPiece(piece.row, piece.col);
      let newBoard = simulateMove(tempPiece, move, tempBoard, skip);
      moves.push(newBoard);
    }
  }
  return moves;
}

function copyBoard() {
  var board = new Board();
  board.board = _.cloneDeep(game.board.board);
  board.redLeft = game.board.redLeft;
  board.LightColorLeft = game.board.LightColorLeft;
  board.redKings = game.board.redKings;
  board.LightColorKings = game.board.LightColorKings;
  return board;
}

function copyPiece(r, columns, color, Game_board) {
  var pawn = new Piece(r, columns, color);
  pawn.king = Game_board.Game_board[r][columns];
  return pawn;
}