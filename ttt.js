const cells = document.querySelectorAll("[cell]");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
];
let options = ["", "", "", "", "", "", "", "",""];
let currentPlayer = "X";
let running = false;
let wins = {
    X: 0,
    O: 0
};

initializeGame();
//this function begins the game
function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    if(options[cellIndex] != "" || !running){
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();
}
//this function lets the cell know what player is clicking it and sets it 
function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
//this function uses ternary to switch the player
function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`
}
//this function uses a standard for loop set up to check the winner by comparing three cells at a time
function checkWinner(){
    let roundWon = false;
    let winningCells = [];

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];
        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            winningCells = condition;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        wins[currentPlayer]++;
        document.getElementById("winCount" + currentPlayer).textContent = wins[currentPlayer];
        running = false;
        alert(`Congratulations Player ${currentPlayer}, You Won!`);

        // Highlight the winning cells
        winningCells.forEach(cellIndex => {
            cells[cellIndex].classList.add("winning-cell");
        });
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

// Reset the game
function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "",""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });
    running = true;
}
