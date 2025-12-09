/**
 * Generates a random integer in the range [min, max] (inclusive).
 * Includes protection against invalid input data.
 *
 */
export class RandomGenerateUtility {
    /**
     * @param {number} min - Minimum value (inclusive).
     * @param {number} max - Maximum value (inclusive).
     * @returns {number} Random number within the specified range.
     * @throws {Error} If parameters are invalid.
     */
    getRandomIntInclusive(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new Error('Arguments must be numbers');
        }

        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            throw new Error('Arguments must be finite numbers');
        }

        if (min > max) {
            throw new Error('min must be less than or equal to max');
        }

        min = Math.ceil(min);
        max = Math.floor(max);

        if (min > max) {
            // This case can happen if e.g. min=1.6, max=1.4
            const temp = min;
            min = max;
            max = temp;
        }

        if (min === max) {
            return min;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
