class Piece {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.king = false;
    // this.direction = this.color === DarkColor ? -1 : 1;
    this.x = 0;
    this.y = 0;
    this.calcPos();
    this.padding = 15;
  }
  calcPos() {
    this.x = squareSize * this.col + Math.floor(squareSize / 2);
    this.y = squareSize * this.row + Math.floor(squareSize / 2)
  }
  makeKing() {
    this.king = true;
  }
  drawSelf() {
    ellipseMode(RADIUS);
    let radius = Math.floor(squareSize/2) - this.padding;
    fill(this.color);
    strokeWeight(2);
		stroke(this.color === DarkColor ? LightColor : DarkColor)
    textAlign(CENTER, CENTER);
    textSize(squareSize/2 - 5);
    circle(this.x, this.y, radius);
    if (this.king) {
      noStroke();
      // text('\uD83D\uDC51', this.x, this.y);
      text('\u269C', this.x, this.y)
      // text('K', this.x, this.y)
    }
  }
  move(row, col) {
    this.row = row;
    this.col = col;
    this.calcPos();
  }
  hello() {
    console.log('I exist');
  }
}