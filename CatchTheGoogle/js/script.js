import { Game } from './game.js';
import { RandomGenerateUtility } from './utility/randomNumberUtility.js';
import { render, setupKeyboardControls } from './view.js';

const randomNumberUtility = new RandomGenerateUtility();

let game;
let currentSettings = {
    columnsCount: 4,
    rowsCount: 4,
    pointsToWin: 5,
    maxJumpsBeforeLose: 10,
    playersCount: 2,
};

function getSettingsFromUI() {
    // Размер сетки
    const gridSelect = document.getElementById('01');
    let gridValue = gridSelect ? gridSelect.value : '4x4';
    let [rows, cols] = gridValue.split('x').map(Number);
    if (!rows || !cols) rows = cols = 4;

    // Очки для победы
    const pointsToWinInput = document.getElementById('points-to-win');
    let pointsToWin = pointsToWinInput ? Number(pointsToWinInput.value) : 5;

    // Промахи до поражения
    const pointsToLoseInput = document.getElementById('points-to-lose');
    let maxJumpsBeforeLose = pointsToLoseInput
        ? Number(pointsToLoseInput.value)
        : 10;

    // Количество игроков
    const playersSelect = document.getElementById('players-count');
    let playersCount = playersSelect ? Number(playersSelect.value) : 2;

    return {
        columnsCount: cols,
        rowsCount: rows,
        pointsToWin,
        maxJumpsBeforeLose,
        playersCount,
    };
}

function updateSettingsFromUI() {
    currentSettings = getSettingsFromUI();
}

function toggleSound() {
    let toggleButton = document.querySelector('.toggle');
    toggleButton.classList.toggle('on');
}

async function start() {
    // Скрыть модальное окно при старте
    const modal = document.querySelector('.modal');
    if (modal) modal.style.display = 'none';
    // Показать игровую зону
    const gameArea = document.querySelector('.game-area');
    if (gameArea) gameArea.classList.remove('hidden');
    updateSettingsFromUI();
    game = new Game(randomNumberUtility, currentSettings.playersCount);
    // Применяем настройки к game
    game.gridSize.columnsCount = currentSettings.columnsCount;
    game.gridSize.rowsCount = currentSettings.rowsCount;
    game.setPointsToWin(currentSettings.pointsToWin);
    game.setMaxJumpsBeforeLose(currentSettings.maxJumpsBeforeLose);
    // Подписка на события для рендера и UI
    game.on('playerMoved', () => render(game));
    game.on('gameStarted', () => render(game));
    game.on('gameStopped', () => render(game));
    game.on('gameReset', () => render(game));
    game.on('gameLost', () => showModal('lose', game));
    game.on('gameWon', (data) => showModal('win', game, data.player));
    game.on('targetCaught', () => render(game));
    game.on('targetJumped', () => render(game));
    await game.start();
    render(game);
    setupKeyboardControls((playerIdx, direction) => {
        game.movePlayerByDirection(playerIdx, direction);
    });
}

function stop() {
    if (game) game.stop();
}

// Модальное окно победы/поражения (универсальное)
function showModal(type, game, winnerPlayer) {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    modal.style.display = 'flex';
    // Скрыть игровую зону
    const gameArea = document.querySelector('.game-area');
    if (gameArea) gameArea.classList.add('hidden');
    // Иконка
    const icon = modal.querySelector('.modal-icon');
    if (icon) {
        icon.src =
            type === 'win'
                ? 'img/icons/winnerIcon.svg'
                : 'img/icons/lossIcon.svg';
    }
    // Заголовок
    const title = modal.querySelector('.title-modal');
    if (title) {
        title.textContent = type === 'win' ? "You're hired!" : 'Rejected';
    }
    // Текст
    const text = modal.querySelector('.text-modal');
    if (text) {
        text.textContent =
            type === 'win' ? 'Congratulations' : "You'll be lucky next time";
    }
    // Результаты
    const catchResult = modal.querySelector('.catch-result');
    const missResult = modal.querySelector('.miss-result');
    if (catchResult)
        catchResult.textContent = winnerPlayer
            ? winnerPlayer.score
            : game.players[0]?.score || 0;
    if (missResult) missResult.textContent = game.targetJumpsCount || 0;
    // Кнопка Play again
    const playAgainBtn = modal.querySelector('.button');
    if (playAgainBtn) {
        playAgainBtn.onclick = () => {
            modal.style.display = 'none';
            if (gameArea) gameArea.classList.remove('hidden');
            start();
        };
    }
    // Кнопка Settings
    const settingsBtn = modal.querySelector('.settings-button');
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            modal.style.display = 'none';
            if (gameArea) gameArea.classList.remove('hidden');
            if (game && typeof game.toSettingsState === 'function') {
                game.toSettingsState();
                render(game);
            }
        };
    }
}

// Обработка select'ов для обновления настроек
['01', 'points-to-win', 'points-to-lose', 'players-count'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateSettingsFromUI);
});

document.querySelector('.main-button').addEventListener('click', start);
document.querySelector('.toggle').addEventListener('click', toggleSound);

// Expose functions to global scope for HTML onclick attributes
// window.toggleSound = toggleSound;
