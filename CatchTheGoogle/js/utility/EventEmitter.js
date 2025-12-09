export class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Подписывается на событие
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Отписывается от события
     */
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(
                (cb) => cb !== callback
            );
        }
    }

    /**
     * Генерирует событие
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach((callback) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(
                        `Error in event handler for ${event}:`,
                        error
                    );
                }
            });
        }
    }

    /**
     * Очищает все события
     */
    clear() {
        this.events = {};
    }

    /**
     * Получает количество подписчиков на событие
     */
    getListenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
}
