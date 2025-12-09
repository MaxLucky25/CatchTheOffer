import { GameStatuses } from './gameStatuses.js';

export class GameStateManager {
    constructor() {
        this.status = GameStatuses.SETTINGS;
        this.targetJumpsCount = 0;
        this.maxJumpsBeforeLose = 10;
        this.pointsToWin = 5;
    }

    /**
     * Проверяет, можно ли запустить игру
     */
    canStart() {
        return this.status === GameStatuses.SETTINGS;
    }

    /**
     * Проверяет, идет ли игра
     */
    isInProgress() {
        return this.status === GameStatuses.IN_PROGRESS;
    }

    /**
     * Проверяет, закончена ли игра
     */
    isFinished() {
        return (
            this.status === GameStatuses.WIN ||
            this.status === GameStatuses.LOSE
        );
    }

    /**
     * Проверяет условие победы
     */
    checkWinCondition(playerScore) {
        return playerScore >= this.pointsToWin;
    }

    /**
     * Проверяет условие поражения
     */
    checkLoseCondition() {
        return this.targetJumpsCount >= this.maxJumpsBeforeLose;
    }

    /**
     * Устанавливает статус игры
     */
    setStatus(status) {
        this.status = status;
    }

    /**
     * Увеличивает счетчик прыжков Target
     */
    incrementTargetJumps() {
        this.targetJumpsCount++;
    }

    /**
     * Сбрасывает состояние игры
     */
    reset() {
        this.status = GameStatuses.SETTINGS;
        this.targetJumpsCount = 0;
    }

    /**
     * Устанавливает количество очков для победы
     */
    setPointsToWin(points) {
        this.pointsToWin = points;
    }

    /**
     * Устанавливает максимальное количество прыжков Target
     */
    setMaxJumpsBeforeLose(jumps) {
        this.maxJumpsBeforeLose = jumps;
    }
}
