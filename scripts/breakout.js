const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let ballRadius = 10;
let x;
let y;
let dx = 3;
let dy = -3;
let paddleHeight = 10;
let paddleWidth = 120;
let paddleX;
let rightPressed = false;
let leftPressed = false;

// Default grid size values, updated by sliders
let brickRowCount = 5;
let brickColumnCount = 9;
let brickWidth = 75;
let brickHeight = 30;
let brickPadding = 10;
let brickOffsetTop = 50;
let brickOffsetLeft = 50;
let score = 0;
let lives = 3;

// Different colors for bricks
const brickColors = ["#FF0000", "#FF8000", "#FFFF00", "#00FF00", "#0000FF", "#FF00FF"];

// Bricks array
let bricks = [];
createBricks();

// Key listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Slider listeners
document.getElementById("brickRows").addEventListener("input", updateBrickGrid);
document.getElementById("brickCols").addEventListener("input", updateBrickGrid);
document.getElementById("paddleSize").addEventListener("input", updatePaddleSize);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Create bricks based on slider values
function createBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[r % brickColors.length] };
    }
  }
  updateCanvasSize(); // Recalculate canvas size whenever bricks change
}

// Update canvas size based on number of bricks and paddings
function updateCanvasSize() {
  const totalWidth = brickColumnCount * (brickWidth + brickPadding) + brickOffsetLeft * 2;
  const totalHeight = brickRowCount * (brickHeight + brickPadding) + brickOffsetTop + 100;  // Extra space for paddle and ball
  
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  
  // Reinitialize positions
  resetBallPosition();
  paddleX = (canvas.width - paddleWidth) / 2;
}

// Update brick grid based on sliders
function updateBrickGrid() {
  brickRowCount = document.getElementById("brickRows").value;
  brickColumnCount = document.getElementById("brickCols").value;
  score = 0; // Reset score when changing grid size
  lives = 3; // Reset lives when changing grid size
  createBricks();
  resetBallPosition();
}

// Update paddle size based on slider (without resetting score or grid)
function updatePaddleSize() {
  paddleWidth = document.getElementById("paddleSize").value;
  paddleX = (canvas.width - paddleWidth) / 2;
  // Do not reset score or grid
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks with colors
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Draw score
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// Draw lives
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Reset ball position after changes in canvas or grid
function resetBallPosition() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 3;
  dy = -3;
}

// Draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Ball movement
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        resetBallPosition();
      }
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

// Start the game
draw();
