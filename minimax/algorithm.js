function minimax(position, depth, maxPlayer, game) {
  if (depth == 0 || (position.winner() != null && position.winner() != undefined)) {
    return [position.evaluate(), position]
    // return {eval: position.evaluate(), pos: position};
  }
  if (maxPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    let allMoves = getAllMoves(position, LightColor, game);
    for (let m = 0; m < allMoves.length; m++) {
      let move = allMoves[m];
      let evaluation = minimax(move, depth-1, false, game)[0];
      maxEval = Math.max(maxEval, evaluation);
      if (maxEval == evaluation) {
        bestMove = move;
      }
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    let bestMove = null;
    let allMoves = getAllMoves(position, DarkColor, game);
    for (let m = 0; m < allMoves.length; m++) {
      let move = allMoves[m];
      let evaluation = minimax(move, depth-1, true, game)[0];
      minEval = Math.min(minEval, evaluation);
      if (minEval == evaluation) {
        bestMove = move;
      }
    }
    return [minEval, bestMove];
  }
}
function simulateMove(piece, move, board, game, skip) {
  board.move(piece, move[0], move[1]);
  if (skip.length > 0) {
      board.remove(skip);
  }
  return board;
}

function getAllMoves(board, color, game) {
  let moves = [];
  let allPieces = board.getAllPieces(color);
  for (let p = 0; p < allPieces.length; p++) {
    let piece = allPieces[p];
    let validMoves = board.getForcedValidMoves(piece, color);
    for (var m = 0; m < validMoves.length; m++) {
      let move = validMoves[m].m;
      let skip = validMoves[m].j;
      // console.log(skip);
      let tempBoard = copyBoard();
      let tempPiece = tempBoard.board[piece.row][piece.col];//getPiece(piece.row, piece.col);
      let newBoard = simulateMove(tempPiece, move, tempBoard, game, skip);
      moves.push(newBoard);
    }
  }
  return moves;
}

function copyBoard() {
  var board = new Board();
  board.board = _.cloneDeep(game.board.board);
  // board.board = JSON.parse(JSON.stringify(game.board.board));
  board.redLeft = game.board.redLeft;
  board.LightColorLeft = game.board.LightColorLeft;
  board.redKings = game.board.redKings;
  board.LightColorKings = game.board.LightColorKings;
  // console.log(board.board[1][2]).hello();
  return board;
}

function copyPiece(row, col, color, board) {
  var piece = new Piece(row, col, color);
  piece.king = board.board[row][col];
  return piece;
}