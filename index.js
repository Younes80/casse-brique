var canvas = document.getElementById('myCanvas');
var message = document.getElementById('message');
var ctx = canvas.getContext('2d');

var interval = getRandomArbitrary(10, 30);
var randomColor = getRandomColor();
var score = 0;
var lives = 3;

// variables balle
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = getRandomArbitrary(-2, 4);
var dy = getRandomArbitrary(-8, -2);

// variables Brique
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

// variables Paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
	if (e.key == 'Right' || e.key == 'ArrowRight') {
		rightPressed = true;
	} else if (e.key == 'Left' || e.key == 'ArrowLeft') {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.key == 'Right' || e.key == 'ArrowRight') {
		rightPressed = false;
	} else if (e.key == 'Left' || e.key == 'ArrowLeft') {
		leftPressed = false;
	}
}
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (
		relativeX > paddleWidth / 2 &&
		relativeX < canvas.width - paddleWidth / 2
	) {
		paddleX = relativeX - paddleWidth / 2;
	}
}
function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (
					x > b.x &&
					x < b.x + brickWidth &&
					y > b.y &&
					y < b.y + brickHeight
				) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score == brickRowCount * brickColumnCount) {
						endGame();
					}
				}
			}
		}
	}
}
function drawScore() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#333';
	ctx.fillText('Score: ' + score, 8, 20);
}
function drawLives() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#333';
	ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = randomColor;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#111111';
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#111111';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
		randomColor = getRandomColor();
	}
	if (y + dy < ballRadius) {
		dy = -dy;
		randomColor = getRandomColor();
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if (!lives) {
				message.classList.add('color-lost');
				message.innerHTML = 'GAME OVER';
				dx = 0;
				dy = 0;
				setTimeout(() => {
					window.location.reload();
				}, 2000);
			} else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = getRandomArbitrary(-2, 2);
				dy = getRandomArbitrary(-4, -2);
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
	if (rightPressed) {
		paddleX += 7;
		if (paddleX + paddleWidth > canvas.width) {
			paddleX = canvas.width - paddleWidth;
		}
	} else if (leftPressed) {
		paddleX -= 7;
		if (paddleX < 0) {
			paddleX = 0;
		}
	}

	x += dx;
	y += dy;
	// interval;
}

function startGame() {
	// draw();
	// requestAnimationFrame(draw);
	setInterval(draw, interval);
}

function endGame() {
	message.classList.add('color-win');
	message.innerHTML = "Bravo ! C'est gagné 🥳";
	dx = 0;
	dy = 0;
	setTimeout(() => {
		window.location.reload();
	}, 2000);
}
