// script.js

let board;
let currentPlayer;
let isSinglePlayer;
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const modePopup = document.getElementById('modePopup');
const gameWrapper = document.getElementById('gameWrapper');
const startGameButton = document.getElementById('startGameButton');
const backButton = document.getElementById('backButton');

function init() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    isSinglePlayer = document.querySelector('input[name="mode"]:checked').value === 'single';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.transform = 'scale(1)';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (!board[index]) {
        makeMove(cell, index);
        if (!checkWin(currentPlayer) && isSinglePlayer && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function makeMove(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    if (checkWin(currentPlayer)) {
        setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        }, 200);
    } else if (board.every(cell => cell)) {
        setTimeout(() => alert('Draw!'), 200);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function computerMove() {
    const bestMove = getBestMove(board);
    const cell = cells[bestMove];
    makeMove(cell, bestMove);
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false, -Infinity, Infinity);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    if (checkWin('O')) {
        return 1;
    }
    if (checkWin('X')) {
        return -1;
    }
    if (board.every(cell => cell)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return board[index] === player;
        });
    });
}

function showGame() {
    modePopup.style.display = 'none';
    gameWrapper.style.display = 'block';
    init();
}

function showPopup() {
    gameWrapper.style.display = 'none';
    modePopup.style.display = 'flex';
}

restartButton.addEventListener('click', init);
startGameButton.addEventListener('click', showGame);
backButton.addEventListener('click', showPopup);
modeRadios.forEach(radio => radio.addEventListener('change', init));

init();
