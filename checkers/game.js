class Game {
	constructor() {
		this.init();
	}
	update() {
		this.board.draw();
		this.drawValidMoves(this.validMoves);
	}
	init() {
		this.selected = null;
		this.board = new Board();
		this.turn = DarkColor;
		this.validMoves = [];
	}
	winner() {
		if (this.board == null) {return this.turn;}
		return this.board.redLeft <= 0 ? LightColor : this.board.whiteLeft <= 0 ? DarkColor : null;
	}
	reset() {
		this.init();
	}
	select(row, col) {
		if (this.selected !== null) {
			let result = this.move(row, col);
			if (!result) {
				this.selected = null;
				this.select(row, col);
			}
		}
		let piece = this.board.getPiece(row, col);
		if (piece != 0 && piece.color == this.turn) {
			let maxJumps = Math.max(...this.board.getAllPieces(this.turn).filter(x => this.board.getValidMoves(x).length > 0).map(y => Math.max(...this.board.getValidMoves(y).map(z => z.j.length))));
			let jumpCount = Math.min(...this.board.getValidMoves(piece).map(x => x.j.length));
			if ((maxJumps > 0 && jumpCount > 0) || (maxJumps == 0)) {
				this.selected = piece;
				this.validMoves = this.board.getValidMoves(piece);
				return true;
			} else this.validMoves = [];
		} else this.validMoves = [];
		return false;
	}
	move(row, col) {
		let piece = this.board.getPiece(row, col);
		var validMoves = [];
		if (Array.isArray(this.validMoves)) {
			validMoves = this.validMoves.map(x => x.m);
		}
		if (this.selected !== null && this.selected !== undefined && piece === 0 && validMoves.includesArray([row, col])) {
			this.board.move(this.selected, row, col);
			let skipped = this.validMoves.spot(row, col).j;
			if (skipped.length > 0) {
				this.board.remove(skipped);
			}
			this.changeTurn();
		} else {
			return false;
		}
		return true;
	}
	drawValidMoves(moves) {
		if (typeof moves === 'object' && moves.length > 0) {
			for (let m = 0; m < moves.length; m++) {
				let move = moves[m];
				fill(Blue);
				noStroke();
				circle(move.m[1] * squareSize + Math.floor(squareSize / 2),
					move.m[0] * squareSize + Math.floor(squareSize / 2),
					20);
			}
		}
	}
	changeTurn() {
		this.validMoves = [];
		this.turn = this.turn == DarkColor ? LightColor : DarkColor;
	}
	getBoard() {
		return this.board;
	}
	aiMove(board) {
		this.board = board;
		this.changeTurn();
	}
	movePieceTo(r, c, r1, c1) {
		this.board.move(this.board.getPiece(r, c), r1, c1);
	}
	gamePlayAI(game) {
		if (game.turn == LightColor) {
			let miniMax = minimax(game.getBoard(), 4, true, this);
			let value = miniMax[0];
			let newBoard = miniMax[1];
			game.aiMove(newBoard);
		}
	}
	gamePlayHuman() {
	}
	winCheck() {
		
	}
}