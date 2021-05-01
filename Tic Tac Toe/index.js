const statusBox = document.querySelector('.status')
const restartBtn = document.querySelector('.restart')

let gameActive = true

let players = ["X", "O"]

let currentPlayer = players[1]

let boardState = ["", "", "", "", "X", "", "", "", ""]

let statusMessage = {
    "winX": `Player: X has won!`,
    "winO": `Player: O has won! (Not Happening)`,
    "draw": `Draw!`
}

const winningConditions = [
    [0, 1, 2],
    [0, 3, 6],
    [2, 5, 8],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [1, 4, 7],
    [3, 4, 5]
]

function CellClicked(CellId, nextStep) {
    if (boardState[CellId] !== "" || !gameActive) return;
    boardState[CellId] = currentPlayer;
    document.querySelector(`.cell[data-cell-id='${CellId}']`).innerHTML = currentPlayer;
    ResultValidation(false);

    if (nextStep) {
        switchPlayer();
        computerTurn();
        switchPlayer();
    }
}

function ResultValidation(isMinimaxRun) {
    let winnerFound = false;
    let winner;

    for (let i = 0; i <= 6; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];
        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            winner = a;
            winnerFound = true;
            break;
        }
    }
    
    if (winnerFound) {
        if (isMinimaxRun) {
            return winner;
        } else {
            statusBox.innerHTML = statusMessage[`win${winner}`];
            restartBtn.style.visibility = "visible";
            gameActive = false;
            return;
        }
    }

    let noWinner = !boardState.includes("");
    if (noWinner) {
        if (isMinimaxRun) {
            return 'tie';
        } else {
            statusBox.innerHTML = statusMessage["draw"];
            restartBtn.style.visibility = "visible";
            gameActive = false;
            return;
        }
    }

    if (isMinimaxRun) {
        return null;
    }
}

function switchPlayer() {
    currentPlayer = (currentPlayer === players[1]) ? players[0] : players[1];
}

function computerTurn() {
    let bestScore = -Infinity;
    let bestMoveCellId;

    for (let index = 0; index < 9; index++) {
        if (boardState[index] == "") {
            boardState[index] = players[0];
            let score = minimax(boardState, 0, false);
            boardState[index] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMoveCellId = index;
            }
        }
    }

    CellClicked(bestMoveCellId, false);
}

let scores = {
    X: 1,
    O: -1,
    tie: 0
}

function minimax(boardState, depth, isMaximizing) {
    let result = ResultValidation(true);

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let index = 0; index < 9; index++) {
            if (boardState[index] == "") {
                boardState[index] = players[0];
                let score = minimax(boardState, depth + 1, false);
                boardState[index] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let index = 0; index < 9; index++) {
            if (boardState[index] == "") {
                boardState[index] = players[1];
                let score = minimax(boardState, depth + 1, true);
                boardState[index] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}