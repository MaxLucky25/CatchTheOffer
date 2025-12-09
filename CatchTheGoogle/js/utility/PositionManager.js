import { Position } from '../entities/Position.js';

export class PositionManager {
    constructor(settings, randomUtility) {
        this.settings = settings;
        this.random = randomUtility;
    }

    getNewUniquePosition(exclude = []) {
        let newPosition;
        let attempts = 0;
        const maxAttempts = 100;
        do {
            newPosition = new Position(
                this.random.getRandomIntInclusive(
                    0,
                    this.settings.gridSettings.columnsCount - 1
                ),
                this.random.getRandomIntInclusive(
                    0,
                    this.settings.gridSettings.rowsCount - 1
                )
            );
            attempts++;
            if (attempts > maxAttempts) {
                throw new Error(
                    'Cannot find unique position after 100 attempts'
                );
            }
        } while (!Position.isUnique(newPosition, exclude));
        return newPosition;
    }
}
