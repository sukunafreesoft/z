// Инициализация переменных для очков
let playerScore = localStorage.getItem('playerScore') ? parseInt(localStorage.getItem('playerScore')) : 0;
let botScore = localStorage.getItem('botScore') ? parseInt(localStorage.getItem('botScore')) : 0;

const playerScoreElement = document.getElementById("player-score");
const botScoreElement = document.getElementById("bot-score");
const gameStatusElement = document.getElementById("game-status");

// Инициализация звуков
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.wav');
const drawSound = new Audio('sounds/draw.wav');

let board = ['', '', '', '', '', '', '', '', '']; // Массив для состояния игры
let currentPlayer = 'X'; // Игрок начинает первым

// Обновляем отображение очков
function updateScores() {
    playerScoreElement.textContent = `Твои очки: ${playerScore}`;
    botScoreElement.textContent = `Очки Сукуны: ${botScore}`;
    // Сохраняем очки в localStorage
    localStorage.setItem('playerScore', playerScore);
    localStorage.setItem('botScore', botScore);
}

// Обновляем статус игры
function updateGameStatus(message) {
    gameStatusElement.textContent = message;
}

// Проверка на победителя
function checkWinner() {
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

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'draw';
}

// Обновляем доску после хода
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Ход игрока
function playerMove(index) {
    if (board[index] === '' && currentPlayer === 'X') {
        board[index] = 'X';
        renderBoard();
        currentPlayer = 'O';
        let winner = checkWinner();
        if (winner) {
            handleGameEnd(winner);
        } else {
            setTimeout(botMove, 500); // Подождем немного, чтобы бот сделал ход
        }
    }
}

// Ход бота с алгоритмом Минмакс
function botMove() {
    if (currentPlayer === 'O') {
        let bestMove = minimax(board, 'O');
        board[bestMove.index] = 'O';
        renderBoard();
        currentPlayer = 'X';

        let winner = checkWinner();
        if (winner) {
            handleGameEnd(winner);
        }
    }
}

// Обработка конца игры
function handleGameEnd(winner) {
    if (winner === 'X') {
        playerScore++;
        updateScores();
        updateGameStatus("А ты харош...");
        winSound.play(); // Звук выигрыша
    } else if (winner === 'O') {
        botScore++;
        updateScores();
        updateGameStatus("Ха Сукуна выиграл...");
        loseSound.play(); // Звук проигрыша
    } else {
        updateGameStatus("Не ты Не я =)");
        drawSound.play(); // Звук ничьей
    }
    setTimeout(resetGame, 2000);
}

// Алгоритм Минмакс для выбора наилучшего хода для бота
function minimax(board, player) {
    const winner = checkWinner();
    if (winner === 'X') return { score: -1 };
    if (winner === 'O') return { score: 1 };
    if (winner === 'draw') return { score: 0 };

    let moves = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = player;
            let result = minimax(board, player === 'O' ? 'X' : 'O');
            moves.push({ index: i, score: result.score });
            board[i] = '';
        }
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// Сброс игры
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    renderBoard();
    updateGameStatus("Ну шо играем?");
}

// Сбросить все очки
function resetAllScores() {
    playerScore = 0;
    botScore = 0;
    updateScores();
    resetGame();
}

// Установка обработчиков для каждой клетки
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => playerMove(index));
});

// Сброс игры по кнопке
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Сбросить все очки
document.getElementById('reset-all-btn').addEventListener('click', resetAllScores);

// Инициализация игры при загрузке страницы
updateScores();
updateGameStatus("Ну шо играем?");
renderBoard();
