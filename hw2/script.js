// Select game board, score display, and leaderboard table
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const leaderboardTable = document.getElementById("leaderboard-table");

const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = { x: 0, y: 0 };
let score = 0;
let gameLoop = null;
let playerName = "";

// Function to prompt for player name
function getPlayerName() {
    playerName = prompt("Enter your name for the leaderboard:", "Player");
    if (!playerName) playerName = "Player";
}

// Create the grid
function createGameBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `cell-${i}-${j}`;
            gameBoard.appendChild(cell);
        }
    }
}

// Draw snake and food
function draw() {
    createGameBoard();

    snake.forEach((segment, index) => {
        const cell = document.getElementById(`cell-${segment.y}-${segment.x}`);
        if (cell) {
            cell.classList.add("snake");
            if (index === 0) cell.classList.add("head");
        }
    });

    const foodCell = document.getElementById(`cell-${food.y}-${food.x}`);
    if (foodCell) foodCell.classList.add("food");
}

// Generate food
function generateFood() {
    return { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
}

// Update snake position
function update() {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check collisions
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize || checkSelfCollision()) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.innerText = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Check self-collision
function checkSelfCollision() {
    return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
}

// End the game
function endGame() {
    clearInterval(gameLoop);
    alert(`Game Over! Score: ${score}`);
    saveScore(playerName, score);
    loadLeaderboard();
}

// Save score to LocalStorage
function saveScore(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Load leaderboard from LocalStorage
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardTable.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
        </tr>
    `;
    leaderboard.forEach((entry, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
            </tr>
        `;
        leaderboardTable.innerHTML += row;
    });
}

// Reset the game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    score = 0;
    scoreDisplay.innerText = score;
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 200);
    draw();
}

// Change direction based on key input
function changeDirection(event) {
    if (event.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
    else if (event.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
    else if (event.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
    else if (event.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});
пше
// Initialize the game
document.addEventListener("keydown", changeDirection);
getPlayerName();
resetGame();
loadLeaderboard();