// View/UI слой для CatchTheGoogle

/**
 * Динамически рендерит игровое поле (таблицу) по размеру сетки
 * @param {Object} gridSize - {rows, cols}
 */
export function renderGrid(gridSize) {
    const table = document.querySelector('.table tbody');
    if (!table) return;
    table.innerHTML = '';
    for (let y = 0; y < gridSize.rows; y++) {
        const tr = document.createElement('tr');
        for (let x = 0; x < gridSize.cols; x++) {
            const td = document.createElement('td');
            td.className = 'cell';
            td.id = `r${y}c${x}`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

/**
 * Рендерит игровое поле и игроков
 * @param {Object} game - инстанс Game
 */
export function render(game) {
    // Проверка и рендер сетки
    const table = document.querySelector('.table tbody');
    const expectedRows = game.gridSize?.rowsCount || 5;
    const expectedCols = game.gridSize?.columnsCount || 5;
    if (
        !table ||
        table.children.length !== expectedRows ||
        (table.children[0] &&
            table.children[0].children.length !== expectedCols)
    ) {
        renderGrid({ rows: expectedRows, cols: expectedCols });
    }
    // Очистка всех ячеек
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells) {
        cell.innerHTML = '';
    }

    // Обновление счетчиков Catch и Miss
    const catchCounter = document.querySelector(
        '.result-container .result-block .result'
    );
    const missCounter = document.querySelectorAll(
        '.result-container .result-block .result'
    )[1];
    if (catchCounter) {
        // Суммируем все totalCatches у игроков
        const totalCatches = game.players.reduce(
            (sum, p) => sum + (p.totalCatches || 0),
            0
        );
        catchCounter.textContent = totalCatches;
    }
    if (missCounter) {
        missCounter.textContent = game.targetJumpsCount || 0;
    }

    // Рендер игроков
    if (game) {
        for (const player of game.players) {
            const cell = getCell(player.position);
            if (cell) {
                cell.innerHTML = `<img src="img/icons/man01.svg" alt="player">`;
            }
        }

        // Рендер Target
        if (game.target) {
            const cell = getCell(game.target.position);
            if (cell) {
                cell.innerHTML = `<img src="img/icons/targetIcon.svg" alt="target">`;
            }
        }

        // Рендер очков игроков
        const scoresBlock = document.querySelector('.players-scores');
        if (scoresBlock) {
            scoresBlock.innerHTML = game.players
                .map(
                    (player, idx) =>
                        `<div class="player-score">
                            <img src="img/icons/man01.svg" alt="player" class="player-icon">
                            <span class="player-label">Player ${idx + 1}:</span>
                            <span class="score-value">${player.score}</span>
                        </div>`
                )
                .join('');
        }
        renderAchievements(game);
    }
}

/**
 * Получает DOM-ячейку по позиции
 * @param {Object} position - {x, y}
 */
export function getCell(position) {
    return document.getElementById(`r${position.y}c${position.x}`);
}

/**
 * Навешивает обработчик нажатий клавиш для управления игроками
 * @param {Function} movePlayerByDirection - функция для движения игрока
 */
export function setupKeyboardControls(movePlayerByDirection) {
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'ArrowUp':
                movePlayerByDirection(0, 'up');
                break;
            case 'ArrowDown':
                movePlayerByDirection(0, 'down');
                break;
            case 'ArrowLeft':
                movePlayerByDirection(0, 'left');
                break;
            case 'ArrowRight':
                movePlayerByDirection(0, 'right');
                break;
            case 'KeyW':
                movePlayerByDirection(1, 'up');
                break;
            case 'KeyS':
                movePlayerByDirection(1, 'down');
                break;
            case 'KeyA':
                movePlayerByDirection(1, 'left');
                break;
            case 'KeyD':
                movePlayerByDirection(1, 'right');
                break;
        }
    });
}

/**
 * Рендерит достижения
 * @param {Object} game - инстанс Game
 */
export function renderAchievements(game) {
    const block = document.querySelector('.achievements-block');
    if (!block) return;
    const achievements = game.achievements.getUnlockedAchievements();
    if (!achievements.length) {
        block.innerHTML = '<div class="no-achievements">Нет достижений</div>';
        return;
    }
    block.innerHTML =
        '<div class="achievements-title">Достижения:</div>' +
        achievements
            .map(
                (a) =>
                    `<div class="achievement"><b>${a.name}</b>: ${a.description}</div>`
            )
            .join('');
}
