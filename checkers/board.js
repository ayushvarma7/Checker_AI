class Board {
  constructor() {
    this.board = [];
    this.redLeft = 12;
    this.whiteLeft = 12;
    this.redKings = 0;
    this.whiteKings = 0;
    this.createBoard();
		this.hello = 'here';
  }
  drawSquares() {
    background(BoardLightColor);
    for (let row = 0; row < Rows; row++) {
      for (let col = (row + 1) % 2; col < Cols; col += 2) {
        fill(BoardDarkColor);
        noStroke();
        square(row * squareSize, col * squareSize, squareSize);
      }
    }
  }
  evaluate() {
    return this.whiteLeft - this.redLeft;
  }
  getAllPieces(color) {
    let pieces = [];
    for (let r = 0; r < this.board.length; r++) {
      for (let p = 0; p < this.board[r].length; p++) {
        let piece = this.board[r][p];
        if (piece !== 0) {
          if (piece.color == color) pieces.push(piece);
        }
      }
    }
    return pieces;
  }
  move(piece, row, col) {
    let current = this.board[piece.row][piece.col];
    this.board[piece.row][piece.col] = this.board[row][col];
    this.board[row][col] = current;
    piece.move(row, col);

    if (row == Rows -1 || row == 0) {
      piece.makeKing();
      if (piece.color == LightColor) {
        this.whiteKings += 1;
      } else {
        this.redKings += 1;
      }
    }
  }
  getPiece(row, col) {
    return this.board[row][col];
  }
  createBoard() {
    for (let row = 0; row < Rows; row++) {
      this.board.push([]);
      for (let col = 0; col < Cols; col++) {
        if (col % 2 == (row + 1) % 2) {
          if (row < 3) {
            this.board[row].push(new Piece(row, col, LightColor));
          } else if (row > 4) {
            this.board[row].push(new Piece(row, col, DarkColor));
          } else {
            this.board[row].push(0);
          }
        } else {
          this.board[row].push(0);
        }
      }
    }
  }
  draw() {
    this.drawSquares();
    for (let row = 0; row < Rows; row++) {
      for (let col = 0; col < Cols; col++) {
        let piece = this.board[row][col];
        if (piece !== 0) {
          piece.drawSelf();
        }
      }
    }
  }
  remove(pieces) {
    for (var p = 0; p < pieces.length; p++) {
      let piece = pieces[p];
      this.board[piece.row][piece.col] = 0;
      if (piece != 0) {
        if (piece.color == DarkColor) {
          this.redLeft -= 1;
        } else {
          this.whiteLeft -= 1;
        }
      }
    }
  }
  winner() {
    return this.redLeft <= 0 ? LightColor : this.whiteLeft <= 0 ? DarkColor : null;
  }
  getValidMoves(piece) {
    let moves = []; // {m: [], j: []}
    let left = piece.col - 1;
    let right = piece.col + 1;
    let row = piece.row; // This is the row that we are currently on
    // "row - 3" allows you to look real far up, but -1 is meant to keep us from going beyond the top
    if (piece.color == DarkColor || piece.king) { // "row - 1" tells us to look below the row that we are on
      let leftRed = this.traverseLeftRed(row - 1, Math.max(row - 3, -1), -1, piece.color, left);
      let rightRed = this.traverseRightRed(row - 1, Math.max(row - 3, -1), -1, piece.color, right);
      moves.update(leftRed);
      moves.update(rightRed);
    }
    if (piece.color == LightColor || piece.king) {
      let leftWhite = this.traverseLeftWhite(row + 1, Math.min(row + 3, Rows), 1, piece.color, left);
      let rightWhite = this.traverseRightWhite(row + 1, Math.min(row + 3, Rows), 1, piece.color, right);
      moves.update(leftWhite);
      moves.update(rightWhite);
    }
    var maxJumps = Math.max(...moves.map(x => x.j.length));
    moves = moves.filter(x => x.j.length >= maxJumps);
    return moves
  }
  getForcedValidMoves(piece, color) {
    let validMoves = [];
    let maxJumps = Math.max(...this.getAllPieces(color).filter(x => this.getValidMoves(x).length > 0).map(y => Math.max(...this.getValidMoves(y).map(z => z.j.length))));
    let jumpCount = Math.min(...this.getValidMoves(piece).map(x => x.j.length));
    if ((maxJumps > 0 && jumpCount > 0) || (maxJumps == 0)) {
      validMoves = this.getValidMoves(piece);
    }
    return validMoves;
  }
  
  traverseLeftRed(start, stop, step, color, left, skipped = []) { // This would be recursive, if we skipped something... We behae different
    var moves = [];
    let last = [];
    for (let r = start; r > stop; r += step) {
      if (left < 0) {
        break;
      }
      let current = this.board[r][left];
      if (current == 0) { // if square we are looking at is empty
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) {
          moves.update({m: [r, left], j: last.concat(skipped)});
        } else { // if we skipped nothing
          moves.update({
            m: [r, left],
            j: last
          });
        }
        if (last.length > 0) {
          let row;
          if (step == -1) {
            row = Math.max(r - 3, 0);
          } else {
            row = Math.min(r + 3, Rows);
          }
          moves.update(this.traverseLeftRed(r + step, row, step, color, left - 1, skipped = last));
          moves.update(this.traverseRightRed(r + step, row, step, color, left + 1, skipped = last));
        }
        break;
      } else if (current.color === color) {
        break;
      } else {
        last = [current];
      }
      left -= 1;
    }
    return moves;
  }
  traverseRightRed(start, stop, step, color, right, skipped = []) {
    var moves = [];
    let last = [];
    for (let r = start; r > stop; r += step) {
      if (right >= Cols) {
        break;
      }
      let current = this.board[r][right];
      if (current == 0) {
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) { // Second and third and fourth one
          moves.update({m: [r, right], j: last.concat(skipped)});
        } else { // First one
          moves.update({m: [r, right], j: last});
        }
        if (last.length > 0) {
          let row;
          if (step == -1) {
            row = Math.max(r - 3, 0);
          } else {
            row = Math.min(r + 3, Rows);
          }
          moves.update(this.traverseLeftRed(r + step, row, step, color, right - 1, skipped = last));
          moves.update(this.traverseRightRed(r + step, row, step, color, right + 1, skipped = last));
        }
        break;
      } else if (current.color == color) {
        break;
      } else {
        last = [current];
      }
      right += 1;
    }
    return moves;
  }
  traverseLeftWhite(start, stop, step, color, left, skipped = []) { // This would be recursive, if we skipped something... We behae different
    var moves = [];
    let last = [];
    for (let r = start; r < stop; r += step) {
      if (left < 0) {
        break;
      }
      let current = this.board[r][left];
      if (current == 0) { // if square we are looking at is empty
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) {
          moves.update({m: [r, left], j: last.concat(skipped)});
        } else { // if we skipped nothing
          moves.update({
            m: [r, left],
            j: last
          });
        }
        if (last.length > 0) {
          let row;
          if (step == -1) {
            row = Math.max(r - 3, 0);
          } else {
            row = Math.min(r + 3, Rows);
          }
          moves.update(this.traverseLeftWhite(r + step, row, step, color, left - 1, skipped = last));
          moves.update(this.traverseRightWhite(r + step, row, step, color, left + 1, skipped = last));
        }
        break;
      } else if (current.color === color) {
        break;
      } else {
        last = [current];
      }
      left -= 1;
    }
    return moves;
  }
  traverseRightWhite(start, stop, step, color, right, skipped = []) {
    var moves = [];
    let last = [];
    for (let r = start; r < stop; r += step) {
      if (right >= Cols) {
        break;
      }
      let current = this.board[r][right];
      if (current == 0) {
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) {
          moves.update({m: [r, right], j: last.concat(skipped)});
        } else {
          moves.update({m: [r, right], j: last});
        }
        if (last.length > 0) {
          let row;
          if (step == -1) {
            row = Math.max(r - 3, 0);
          } else {
            row = Math.min(r + 3, Rows);
          }
          moves.update(this.traverseLeftWhite(r + step, row, step, color, right - 1, skipped = last));
          moves.update(this.traverseRightWhite(r + step, row, step, color, right + 1, skipped = last));
        }
        break;
      } else if (current.color == color) {
        break;
      } else {
        last = [current];
      }
      right += 1;
    }
    return moves;
  }
}