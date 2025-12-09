export class Player {
    constructor(position) {
        this.position = position;
        this.score = 0;
        this.consecutiveCatches = 0; // Подряд пойманные Google
        this.totalCatches = 0; // Общее количество пойманных Google
    }

    /**
     * Увеличивает счет игрока
     */
    incrementScore() {
        this.score++;
        this.consecutiveCatches++;
        this.totalCatches++;
    }

    /**
     * Сбрасывает счетчик подряд пойманных Google
     */
    resetConsecutiveCatches() {
        this.consecutiveCatches = 0;
    }

    /**
     * Сбрасывает все данные игрока
     */
    reset() {
        this.score = 0;
        this.consecutiveCatches = 0;
        this.totalCatches = 0;
    }

    /**
     * Получает статистику игрока
     */
    getStats() {
        return {
            score: this.score,
            consecutiveCatches: this.consecutiveCatches,
            totalCatches: this.totalCatches,
        };
    }
}
