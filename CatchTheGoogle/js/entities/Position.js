export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Compares this position with another one.
     * @param {Position} otherPosition - The position to compare with.
     * @returns {boolean} - True if positions are equal, false otherwise.
     */
    equals(otherPosition) {
        if (!otherPosition) {
            return false;
        }
        return this.x === otherPosition.x && this.y === otherPosition.y;
    }

    /**
     * Checks if a position is unique in an array of positions.
     * @param {Position} newPosition
     * @param {Position[]} positions
     * @returns {boolean}
     */
    static isUnique(newPosition, positions) {
        return !positions.some((pos) => {
            if (!pos) return false;
            // Проверяем, есть ли метод equals, если нет - сравниваем напрямую
            if (typeof pos.equals === 'function') {
                return pos.equals(newPosition);
            }
            // Для простых объектов с x и y
            return pos.x === newPosition.x && pos.y === newPosition.y;
        });
    }
}
