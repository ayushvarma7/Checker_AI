class ChechersBoard {
  constructor() {
    this.Game_board = [];
    this.Left_of_black_pawn = 12;
    this.Left_of_white_pawn = 12;
    this.King_of_blacks = 0;
    this.King_of_whites = 0;
    this.BoardBuilder();
  }
  SquareBuilder() {
    background(WhiteBGcolor);
    for (let r = 0; r < Total_Rows; r++) {
      for (let columns = (r + 1) % 2; columns < Total_Columns; columns += 2) {
        fill(BlackBGcolor);
        noStroke();
        square(r * Size_of_squares, columns * Size_of_squares, Size_of_squares);
      }
    }
  }
  difference() {
    return this.Left_of_white_pawn - this.Left_of_black_pawn;
  }

  getAllPieces(color) {
    let pawns = [];
    for (let r = 0; r < this.Game_board.length; r++) {
      for (let p = 0; p < this.Game_board[r].length; p++) {
        let pawn = this.Game_board[r][p];
        if (pawn !== 0) {
          if (pawn.color == color) pawns.push(pawn);
        }
      }
    }
    return pawns;
  }
  place(pawn, r, columns) {
    let current = this.Game_board[pawn.r][pawn.columns];
    this.Game_board[pawn.r][pawn.columns] = this.Game_board[r][columns];
    this.Game_board[r][columns] = current;
    pawn.place(r, columns);

    if (r == Total_Rows - 1 || r == 0) {
      pawn.makeKing();
      if (pawn.color == LightColor) {
        this.King_of_whites += 1;
      } else {
        this.King_of_blacks += 1;
      }
    }
  }
  getPawn(r, columns) {
    return this.Game_board[r][columns];
  }
  BoardBuilder() {
    for (let r = 0; r < Total_Rows; r++) {
      this.Game_board.push([]);
      for (let columns = 0; columns < Total_Columns; columns++) {
        if (columns % 2 == (r + 1) % 2) {
          if (r < 3) {
            this.Game_board[r].push(new Piece(r, columns, LightColor));
          } else if (r > 4) {
            this.Game_board[r].push(new Piece(r, columns, DarkColor));
          } else {
            this.Game_board[r].push(0);
          }
        } else {
          this.Game_board[r].push(0);
        }
      }
    }
  }

  draw() {
    this.SquareBuilder();
    for (let r = 0; r < Total_Rows; r++) {
      for (let columns = 0; columns < Total_Columns; columns++) {
        let pawn = this.Game_board[r][columns];
        if (pawn !== 0) {
          pawn.drawSelf();
        }
      }
    }
  }
  remove(pawns) {
    for (var p = 0; p < pawns.length; p++) {
      let pawn = pawns[p];
      this.Game_board[pawn.r][pawn.columns] = 0;
      if (pawn != 0) {
        if (pawn.color == DarkColor) {
          this.Left_of_black_pawn -= 1;
        } else {
          this.Left_of_white_pawn -= 1;
        }
      }
    }
  }

  winner() {
    return this.Left_of_black_pawn <= 0 ? LightColor : this.Left_of_white_pawn <= 0 ? DarkColor : null;
  }
  getValidMoves(pawn) {
    let moves = []; // {m: [], j: []}
    let left = pawn.columns - 1;
    let right = pawn.columns + 1;
    let r = pawn.r; // This is the r that we are currently on
    // "r - 3" allows you to look real far up, but -1 is meant to keep us from going beyond the top
    if (pawn.color == DarkColor || pawn.king) { // "r - 1" tells us to look below the r that we are on
      let leftRed = this.traverseLeftRed(r - 1, Math.max(r - 3, -1), -1, pawn.color, left);
      let rightRed = this.traverseRightRed(r - 1, Math.max(r - 3, -1), -1, pawn.color, right);
      moves.update(leftRed);
      moves.update(rightRed);
    }
    if (pawn.color == LightColor || pawn.king) {
      let leftWhite = this.traverseLeftWhite(r + 1, Math.min(r + 3, Total_Rows), 1, pawn.color, left);
      let rightWhite = this.traverseRightWhite(r + 1, Math.min(r + 3, Total_Rows), 1, pawn.color, right);
      moves.update(leftWhite);
      moves.update(rightWhite);
    }
    var maxJumps = Math.max(...moves.map(x => x.j.length));
    moves = moves.filter(x => x.j.length >= maxJumps);
    return moves
  }
  getForcedValidMoves(pawn, color) {
    let validMoves = [];
    let maxJumps = Math.max(...this.getAllPieces(color).filter(x => this.getValidMoves(x).length > 0).map(y => Math.max(...this.getValidMoves(y).map(z => z.j.length))));
    let jumpCount = Math.min(...this.getValidMoves(pawn).map(x => x.j.length));
    if ((maxJumps > 0 && jumpCount > 0) || (maxJumps == 0)) {
      validMoves = this.getValidMoves(pawn);
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
      let current = this.Game_board[r][left];
      if (current == 0) { // if square we are looking at is empty
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) {
          moves.update({ m: [r, left], j: last.concat(skipped) });
        } else { // if we skipped nothing
          moves.update({
            m: [r, left],
            j: last
          });
        }
        if (last.length > 0) {
          let r;
          if (step == -1) {
            r = Math.max(r - 3, 0);
          } else {
            r = Math.min(r + 3, Total_Rows);
          }
          moves.update(this.traverseLeftRed(r + step, r, step, color, left - 1, skipped = last));
          moves.update(this.traverseRightRed(r + step, r, step, color, left + 1, skipped = last));
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
      if (right >= Total_Columns) {
        break;
      }
      let current = this.Game_board[r][right];
      if (current == 0) {
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) { // Second and third and fourth one
          moves.update({ m: [r, right], j: last.concat(skipped) });
        } else { // First one
          moves.update({ m: [r, right], j: last });
        }
        if (last.length > 0) {
          let r;
          if (step == -1) {
            r = Math.max(r - 3, 0);
          } else {
            r = Math.min(r + 3, Total_Rows);
          }
          moves.update(this.traverseLeftRed(r + step, r, step, color, right - 1, skipped = last));
          moves.update(this.traverseRightRed(r + step, r, step, color, right + 1, skipped = last));
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

  traverseLeftWhite(start, stop, step, color, left, skipped = []) {
    // This would be recursive, if we skipped something... We behae different
    var moves = [];
    let last = [];
    for (let r = start; r < stop; r += step) {
      if (left < 0) {
        break;
      }
      let current = this.Game_board[r][left];
      if (current == 0) { // if square we are looking at is empty
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) {
          moves.update({ m: [r, left], j: last.concat(skipped) });
        } else {
          // if we skipped nothing
          moves.update({
            m: [r, left],
            j: last
          });
        }
        if (last.length > 0) {
          let r;
          if (step == -1) {
            r = Math.max(r - 3, 0);
          } else {
            r = Math.min(r + 3, Total_Rows);
          }
          moves.update(this.traverseLeftWhite(r + step, r, step, color, left - 1, skipped = last));
          moves.update(this.traverseRightWhite(r + step, r, step, color, left + 1, skipped = last));
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
      if (right >= Total_Columns) {
        break;
      }
      let current = this.Game_board[r][right];
      if (current == 0) {
        if (skipped.length > 0 && last.length == 0) {
          break;
        } else if (skipped.length > 0) {
          moves.update({ m: [r, right], j: last.concat(skipped) });
        } else {
          moves.update({ m: [r, right], j: last });
        }
        if (last.length > 0) {
          let r;
          if (step == -1) {
            r = Math.max(r - 3, 0);
          } else {
            r = Math.min(r + 3, Total_Rows);
          }
          moves.update(this.traverseLeftWhite(r + step, r, step, color, right - 1, skipped = last));
          moves.update(this.traverseRightWhite(r + step, r, step, color, right + 1, skipped = last));
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