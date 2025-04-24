const cells = document.querySelectorAll("[cell]");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const modeBtn = document.querySelector("#modeBtn");

let vsComputer = false;
let humanPlayer = "X";
let computerPlayer = "O";
let currentPlayer = "X";
let options = ["", "", "", "", "", "", "", "", ""];
let running = false;

// Initializes winning combinations
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Variables for player wins
let wins = {
    X: 0,
    O: 0
};

// Initializes the game by adding event listeners and setting initial state
function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    modeBtn.addEventListener("click", toggleMode);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

initializeGame();

// Toggles between two-player and vs computer modes and restarts the game
function toggleMode() {
    vsComputer = !vsComputer;
    modeBtn.textContent = vsComputer ? "Switch to 2 Player" : "Play vs Computer";
    document.getElementById("modeStatus").textContent = vsComputer ? "Currently Versing the Computer" : "Currently Playing 2 Player";
    restartGame();
}

// Handles when a cell is clicked, including player and computer moves
function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");
    if (options[cellIndex] !== "" || !running) return;

    updateCell(this, cellIndex);
    checkWinner();

    if (vsComputer && running && currentPlayer === computerPlayer) {
        setTimeout(() => {
            computerMove();
        }, 500);
    }
}

// Updates the clicked cell with the player's symbol
function updateCell(cell, index, player = currentPlayer) {
    options[index] = player;
    cell.textContent = player;
}

// Switches the current player from X to O or vice versa
function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

// Checks if the current player has won or if there's a draw
function checkWinner() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        const cellA = options[a];
        const cellB = options[b];
        const cellC = options[c];

        if (cellA === "" || cellB === "" || cellC === "") continue;

        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        wins[currentPlayer]++;
        document.getElementById("winCount" + currentPlayer).textContent = wins[currentPlayer];
        running = false;
        winningCells.forEach(i => cells[i].classList.add("winning-cell"));
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

// Resets the board and game state for a new round
function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });
    running = true;
}

// Handles the computer's move with basic strategy and updates the game
function computerMove() {
    currentPlayer = computerPlayer;
    statusText.textContent = "Computer's turn";

    const winningMove = findWinningMove(computerPlayer);
    const blockingMove = findWinningMove(humanPlayer);
    const center = 4;

    let moveIndex;
    if (winningMove !== -1) {
        moveIndex = winningMove;
    } else if (blockingMove !== -1) {
        moveIndex = blockingMove;
    } else if (options[center] === "") {
        moveIndex = center;
    } else {
        const emptyCells = options.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const cell = cells[moveIndex];
    updateCell(cell, moveIndex, computerPlayer);
    checkWinner();
}

// Finds a winning or blocking move for the given player
function findWinningMove(player) {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (options[a] === player && options[b] === player && options[c] === "") return c;
        if (options[a] === player && options[c] === player && options[b] === "") return b;
        if (options[b] === player && options[c] === player && options[a] === "") return a;
    }
    return -1;
}