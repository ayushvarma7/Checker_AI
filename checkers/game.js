class Game {
	constructor() {
		this.init();
	}
	update() {
		this.Game_board.draw();
		this.drawValidMoves(this.validMoves);
	}
	init() {
		this.selected = null;
		this.Game_board = new ChechersBoard();
		this.turn = DarkColor;
		this.validMoves = [];
	}
	winner() {
		if (this.Game_board == null) {return this.turn;}
		return this.Game_board.Left_of_black_pawn <= 0 ? LightColor : this.Game_board.Left_of_white_pawn <= 0 ? DarkColor : null;
	}
	reset() {
		this.init();
	}
	select(r, columns) {
		if (this.selected !== null) {
			let result = this.place(r, columns);
			if (!result) {
				this.selected = null;
				this.select(r, columns);
			}
		}
		let pawn = this.Game_board.getPawn(r, columns);
		if (pawn != 0 && pawn.color == this.turn) {
			let maxJumps = Math.max(...this.Game_board.getAllPieces(this.turn).filter(x => this.Game_board.getValidMoves(x).length > 0).map(y => Math.max(...this.Game_board.getValidMoves(y).map(z => z.j.length))));
			let jumpCount = Math.min(...this.Game_board.getValidMoves(pawn).map(x => x.j.length));
			if ((maxJumps > 0 && jumpCount > 0) || (maxJumps == 0)) {
				this.selected = pawn;
				this.validMoves = this.Game_board.getValidMoves(pawn);
				return true;
			} else this.validMoves = [];
		} else this.validMoves = [];
		return false;
	}
	place(r, columns) {
		let pawn = this.Game_board.getPawn(r, columns);
		var validMoves = [];
		if (Array.isArray(this.validMoves)) {
			validMoves = this.validMoves.map(x => x.m);
		}
		if (this.selected !== null && this.selected !== undefined && pawn === 0 && validMoves.includesArray([r, columns])) {
			this.Game_board.place(this.selected, r, columns);
			let skipped = this.validMoves.spot(r, columns).j;
			if (skipped.length > 0) {
				this.Game_board.remove(skipped);
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
				let place = moves[m];
				fill(Blue);
				noStroke();
				circle(place.m[1] * Size_of_squares + Math.floor(Size_of_squares / 2),
					place.m[0] * Size_of_squares + Math.floor(Size_of_squares / 2),
					20);
			}
		}
	}
	changeTurn() {
		this.validMoves = [];
		this.turn = this.turn == DarkColor ? LightColor : DarkColor;
	}
	getBoard() {
		return this.Game_board;
	}
	aiMove(Game_board) {
		this.Game_board = Game_board;
		this.changeTurn();
	}
	movePieceTo(r, c, r1, c1) {
		this.Game_board.place(this.Game_board.getPawn(r, c), r1, c1);
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