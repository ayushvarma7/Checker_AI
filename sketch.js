var Fps = 5;
var game;
var gamePlay;
var player1Name;
var player2Name;
var clyde = '\uD83C\uDDE8'
var Computer_AI = '\uD83C\uDDEB';

function getMousePos(pos) {
	let x = pos.x, y = pos.y;
	let r = Math.floor(y / Size_of_squares);
	let columns = Math.floor(x / Size_of_squares);
	return { r: r, c: columns };
}

function setup() {
	createCanvas(Width, Height);
	frameRate(Fps);
	game = new Game();
	player2Name = prompt(`${Computer_AI}: I'd like to know the name of my opponent first.`);
	gamePlay = game.gamePlayAI;
	// gamePlay = game.gamePlayHuman;
}

function draw() {
	clear();
	game.update();
	gamePlay(game);
	winCheck();
}

function mousePressed() {
	var pos = { x: mouseX, y: mouseY };
	var square = getMousePos(pos);
	game.select(square.r, square.c);
}

function keyPressed() {
	if (keyCode === ESCAPE) {
		game.validMoves = [];
		game.selected = null;
	}
}

function winCheck() {
	// console.log(game.Game_board.hello);
	let winner = game.winner();
	if (winner !== null && winner !== undefined) {
		noLoop();
		let winnerName = winner === LightColor ? player1Name : player2Name;
		let winner_poster = document.getElementById('winner_poster');
		let winner_background = document.getElementById('winner_background');
		winnerText = `${clyde}: ${winnerName} is the Winner!!!`;
		winner_background.style.display = "flex";
		winner_poster.innerText = winnerText;
		confetti.start(12000);
	}
}