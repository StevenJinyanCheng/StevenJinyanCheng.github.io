const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let canvasSize = 400; // Start with initial canvas size
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [
    { x: gridSize * 5, y: gridSize * 5 },
    { x: gridSize * 4, y: gridSize * 5 },
    { x: gridSize * 3, y: gridSize * 5 }
];

let direction = { x: gridSize, y: 0 };
let food = getRandomFoodPosition();
let gameOver = false;

function gameLoop() {
    if (gameOver) {
        alert('Game Over!');
        document.location.reload();
    }

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        checkCollision();
        drawFood();
        drawSnake();
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function moveSnake() {
    let newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wrap around the screen edges
    if (newHead.x < 0) {
        newHead.x = canvasSize - gridSize; // Wrap to the right side
    } else if (newHead.x >= canvasSize) {
        newHead.x = 0; // Wrap to the left side
    }

    if (newHead.y < 0) {
        newHead.y = canvasSize - gridSize; // Wrap to the bottom
    } else if (newHead.y >= canvasSize) {
        newHead.y = 0; // Wrap to the top
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function getRandomFoodPosition() {
    let foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    let foodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x: foodX, y: foodY };
}

function checkCollision() {
    const head = snake[0];

    // Check self collisions
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

document.addEventListener('keydown', event => {
    const key = event.keyCode;

    // Up
    if (key === 38 && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    }
    // Down
    if (key === 40 && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    }
    // Left
    if (key === 37 && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    }
    // Right
    if (key === 39 && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
});

document.getElementById('canvasSizeSlider').addEventListener('input', function(event) {
    canvasSize = parseInt(event.target.value, 10);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    food = getRandomFoodPosition(); // Adjust food position based on new size
});

gameLoop();
