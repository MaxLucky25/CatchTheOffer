export class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.initializeAchievements();
    }

    /**
     * Инициализирует все достижения
     */
    initializeAchievements() {
        this.achievements.set('first_catch', {
            id: 'first_catch',
            name: 'Первая поимка',
            description: 'Поймайте Google в первый раз',
            condition: (player) => player.score === 1,
        });

        this.achievements.set('google_master', {
            id: 'google_master',
            name: 'Мастер Google',
            description: 'Наберите 5 очков',
            condition: (player) => player.score >= 5,
        });

        this.achievements.set('persistent', {
            id: 'persistent',
            name: 'Упорство',
            description: 'Играйте до 10 прыжков Google',
            condition: (gameState) => gameState.googleJumpsCount >= 10,
        });

        this.achievements.set('speed_demon', {
            id: 'speed_demon',
            name: 'Скоростной демон',
            description: 'Поймайте Google 3 раза подряд',
            condition: (player) => player.consecutiveCatches >= 3,
        });
    }

    /**
     * Проверяет достижения для игрока
     */
    checkPlayerAchievements(player) {
        this.achievements.forEach((achievement, key) => {
            if (
                !this.unlockedAchievements.has(key) &&
                achievement.condition(player)
            ) {
                this.unlock(key);
            }
        });
    }

    /**
     * Проверяет достижения для состояния игры
     */
    checkGameAchievements(gameState) {
        this.achievements.forEach((achievement, key) => {
            if (
                !this.unlockedAchievements.has(key) &&
                achievement.condition(gameState)
            ) {
                this.unlock(key);
            }
        });
    }

    /**
     * Разблокирует достижение
     */
    unlock(achievementId) {
        if (this.achievements.has(achievementId)) {
            this.unlockedAchievements.add(achievementId);
            const achievement = this.achievements.get(achievementId);
            console.log(
                `🏆 Достижение разблокировано: ${achievement.name} - ${achievement.description}`
            );
            return achievement;
        }
        return null;
    }

    /**
     * Проверяет, разблокировано ли достижение
     */
    isUnlocked(achievementId) {
        return this.unlockedAchievements.has(achievementId);
    }

    /**
     * Получает все разблокированные достижения
     */
    getUnlockedAchievements() {
        return Array.from(this.unlockedAchievements).map((id) =>
            this.achievements.get(id)
        );
    }

    /**
     * Получает все достижения
     */
    getAllAchievements() {
        return Array.from(this.achievements.values());
    }

    /**
     * Сбрасывает все достижения
     */
    reset() {
        this.unlockedAchievements.clear();
    }
}
