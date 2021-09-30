class Piece {
  constructor(r, columns, color) {
    this.r = r;
    this.columns = columns;
    this.color = color;
    this.king = false;
    // this.direction = this.color === DarkColor ? -1 : 1;
    this.x = 0;
    this.y = 0;
    this.calcPos();
    this.padding = 15;
  }
  calcPos() {
    this.x = Size_of_squares * this.columns + Math.floor(Size_of_squares / 2);
    this.y = Size_of_squares * this.r + Math.floor(Size_of_squares / 2)
  }
  makeKing() {
    this.king = true;
  }
  drawSelf() {
    ellipseMode(RADIUS);
    let radius = Math.floor(Size_of_squares/2) - this.padding;
    fill(this.color);
    strokeWeight(2);
		stroke(this.color === DarkColor ? LightColor : DarkColor)
    textAlign(CENTER, CENTER);
    textSize(Size_of_squares/2 - 5);
    circle(this.x, this.y, radius);
    if (this.king) {
      noStroke();
      // text('\uD83D\uDC51', this.x, this.y);
      text('\u269C', this.x, this.y)
      // text('K', this.x, this.y)
    }
  }
  place(r, columns) {
    this.r = r;
    this.columns = columns;
    this.calcPos();
  }
  // hello() {
  //   console.log('I exist');
  // }
}