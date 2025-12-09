import { GameStatuses, MovementDirections } from './utility/gameStatuses.js';
import { Settings } from './settings/Settings.js';
import { Player } from './entities/Player.js';
import { Position } from './entities/Position.js';
import { GameStateManager } from './utility/GameStateManager.js';
import { TargetController } from './utility/TargetController.js';
import { EventEmitter } from './utility/EventEmitter.js';
import { AchievementSystem } from './utility/AchievementSystem.js';
import { PositionManager } from './utility/PositionManager.js';

export class Game {
    // === Приватные поля ===
    #stateManager;
    #targetController;
    #events;
    #achievements;
    #positionManager;
    #players = [];
    #settings = new Settings();
    #playersCount = 2;

    // === Конструктор ===
    constructor(randomUtility, playersCount = 2) {
        this.#stateManager = new GameStateManager();
        this.#positionManager = new PositionManager(
            this.#settings,
            randomUtility
        );
        this.#targetController = new TargetController(
            this.#positionManager,
            this.#settings.targetSettings
        );
        this.#events = new EventEmitter();
        this.#achievements = new AchievementSystem();
        this.#playersCount = playersCount;
    }

    // === Публичные методы ===

    /**
     * Запуск игры
     */
    async start() {
        if (!this.#stateManager.canStart()) {
            throw new Error('Game must be in settings state to start');
        }

        this.#stateManager.setStatus(GameStatuses.IN_PROGRESS);
        this.#players = [];
        this.#achievements.reset();

        // Создаем игроков
        let occupied = [];
        for (let i = 0; i < this.#playersCount; i++) {
            const pos = this.#positionManager.getNewUniquePosition(occupied);
            this.#players.push(new Player(pos));
            occupied.push(pos);
        }

        // Подписываемся на прыжки Target (гарантируем актуальность callback)
        this.#targetController.setOnJumpCallback(() => {
            this.#stateManager.incrementTargetJumps();
            this.#events.emit('targetJumped');
            if (this.#stateManager.checkLoseCondition()) {
                this.#stateManager.setStatus(GameStatuses.LOSE);
                this.#events.emit('gameLost');
                this.#targetController.stopJumping();
            }
        });

        // Запускаем Target
        this.#targetController.startJumping(occupied);

        this.#events.emit('gameStarted', { players: this.#players });
    }

    /**
     * Остановка игры
     */
    stop() {
        this.#targetController.stopJumping();
        this.#events.emit('gameStopped');
    }

    /**
     * Перевести игру в состояние SETTINGS
     */
    toSettingsState() {
        this.stop();
        this.#stateManager.reset();
        this.#targetController.reset();
        // Сбрасываем состояние игроков
        for (const player of this.#players) {
            if (typeof player.reset === 'function') player.reset();
        }
        this.#players = [];
        this.#events.emit('gameReset');
    }

    /**
     * Двигает игрока в заданном направлении
     */
    movePlayerByDirection(playerIndex, direction) {
        if (!this.#stateManager.isInProgress()) return;

        const player = this.#players[playerIndex];
        if (!player) return;

        const newPosition = this.#calculateNewPosition(
            player.position,
            direction
        );

        if (!this.#validateMove(newPosition, playerIndex)) return;

        player.position = newPosition;
        this.#checkTargetCatch(player);

        this.#events.emit('playerMoved', {
            playerIndex,
            position: newPosition,
        });
    }

    /**
     * Подписывается на события игры
     */
    on(event, callback) {
        this.#events.on(event, callback);
    }

    /**
     * Отписывается от событий игры
     */
    off(event, callback) {
        this.#events.off(event, callback);
    }

    /**
     * Устанавливает количество очков для победы
     */
    setPointsToWin(points) {
        this.#stateManager.setPointsToWin(points);
    }

    /**
     * Устанавливает максимальное количество прыжков Target до поражения
     */
    setMaxJumpsBeforeLose(jumps) {
        this.#stateManager.setMaxJumpsBeforeLose(jumps);
    }

    // === Геттеры и сеттеры ===
    get status() {
        return this.#stateManager.status;
    }

    get target() {
        return this.#targetController.target;
    }

    get players() {
        return this.#players;
    }

    get gridSize() {
        return this.#settings.gridSettings;
    }

    get playersCount() {
        return this.#playersCount;
    }

    get achievements() {
        return this.#achievements;
    }

    get targetJumpsCount() {
        return this.#stateManager.targetJumpsCount;
    }

    set playersCount(count) {
        if (typeof count !== 'number' || count < 1) {
            throw new Error('Players count must be a positive number');
        }
        this.#playersCount = count;
    }

    set targetJumpInterval(newValue) {
        if (typeof newValue !== 'number') {
            throw new TypeError('Arguments must be a numbers');
        }
        if (newValue <= 0) {
            throw new TypeError('Arguments must be positive numbers');
        }
        this.#settings.targetSettings.targetJumpInterval = newValue;
        this.#targetController.restartInterval(newValue);
    }

    // === Приватные методы ===

    /**
     * Вычисляет новую позицию игрока
     */
    #calculateNewPosition(currentPosition, direction) {
        let { x, y } = currentPosition;

        switch (direction) {
            case MovementDirections.UP:
                y -= 1;
                break;
            case MovementDirections.DOWN:
                y += 1;
                break;
            case MovementDirections.LEFT:
                x -= 1;
                break;
            case MovementDirections.RIGHT:
                x += 1;
                break;
            default:
                return currentPosition;
        }

        return new Position(x, y);
    }

    /**
     * Проверяет валидность движения
     */
    #validateMove(newPosition, playerIndex) {
        // Проверка границ
        if (
            newPosition.x < 0 ||
            newPosition.x >= this.#settings.gridSettings.columnsCount
        )
            return false;
        if (
            newPosition.y < 0 ||
            newPosition.y >= this.#settings.gridSettings.rowsCount
        )
            return false;

        // Проверка коллизий с другими игроками
        for (let i = 0; i < this.#players.length; i++) {
            if (i === playerIndex) continue;
            if (this.#players[i].position.equals(newPosition)) return false;
        }

        return true;
    }

    /**
     * Проверяет поимку Target
     */
    #checkTargetCatch(player) {
        if (!this.#targetController.target) return;

        if (player.position.equals(this.#targetController.target.position)) {
            player.incrementScore();

            // Проверяем достижения
            this.#achievements.checkPlayerAchievements(player);

            this.#events.emit('targetCaught', { player, score: player.score });

            if (this.#stateManager.checkWinCondition(player.score)) {
                this.#stateManager.setStatus(GameStatuses.WIN);
                this.#events.emit('gameWon', { player });
                this.#targetController.stopJumping();
                this.#targetController.setOnJumpCallback(null);
                return;
            }

            // Перемещаем Target
            const occupied = this.#players.map((p) => p.position);
            this.#targetController.updateOccupiedPositions(occupied);
            this.#targetController.moveTarget(occupied);
        } else {
            // Сбрасываем счетчик подряд пойманных Target
            player.resetConsecutiveCatches();
        }
    }

    /**
     * Тестовый метод: установить количество прыжков Target
     */
    setTargetJumpsCountForTest(value) {
        this.#stateManager.targetJumpsCount = value;
    }
}
