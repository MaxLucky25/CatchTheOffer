import { Target } from '../entities/Target.js';

export class TargetController {
    constructor(positionManager, settings) {
        this.positionManager = positionManager;
        this.settings = settings;
        this.target = null;
        this.intervalId = null;
        this.occupiedPositions = [];
        this.onJumpCallback = null; // Callback для уведомления о прыжках
    }

    /**
     * Устанавливает callback для уведомления о прыжках
     */
    setOnJumpCallback(callback) {
        this.onJumpCallback = callback;
    }

    /**
     * Обновляет занятые позиции
     */
    updateOccupiedPositions(positions) {
        this.occupiedPositions = positions;
    }

    /**
     * Создает Target в случайной позиции
     */
    createTarget(occupiedPositions) {
        const newPosition =
            this.positionManager.getNewUniquePosition(occupiedPositions);
        this.target = new Target(newPosition);
        return this.target;
    }

    /**
     * Перемещает Target в новую позицию
     */
    moveTarget(occupiedPositions) {
        if (!this.target) {
            this.createTarget(occupiedPositions);
        } else {
            const newPosition =
                this.positionManager.getNewUniquePosition(occupiedPositions);
            this.target.position = newPosition;
        }

        // Уведомляем о прыжке
        if (this.onJumpCallback) {
            this.onJumpCallback();
        }
    }

    /**
     * Начинает автоматические прыжки Target
     */
    startJumping(occupiedPositions) {
        this.occupiedPositions = occupiedPositions;
        this.moveTarget(occupiedPositions);
        this.intervalId = setInterval(() => {
            this.moveTarget(this.occupiedPositions);
        }, this.settings.targetJumpInterval);
    }

    /**
     * Останавливает автоматические прыжки
     */
    stopJumping() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Перезапускает интервал с новым временем
     */
    restartInterval(newInterval) {
        this.stopJumping();
        this.settings.targetJumpInterval = newInterval;
        // Перезапускаем интервал только если игра активна
        if (this.target) {
            this.intervalId = setInterval(() => {
                this.moveTarget(this.occupiedPositions);
            }, this.settings.targetJumpInterval);
        }
    }

    /**
     * Сбрасывает Target
     */
    reset() {
        this.stopJumping();
        this.target = null;
        this.occupiedPositions = [];
        this.onJumpCallback = null;
    }

    /**
     * Получает текущую позицию Target
     */
    getPosition() {
        return this.target ? this.target.position : null;
    }
}
