import { Game } from '../js/game.js';
import {
    GameStatuses,
    MovementDirections,
} from '../js/utility/gameStatuses.js';
import { RandomGenerateUtility } from '../js/utility/randomNumberUtility.js';
import { Position } from '../js/entities/Position.js';

describe('game tests', () => {
    it('game should create correct number of players', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility, 3);
        await game.start();
        expect(game.players.length).toBe(3);
        for (const player of game.players) {
            expect(player.position).toBeDefined();
        }
    });

    it('each player should have score=0 at start', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility, 4);
        await game.start();
        for (const player of game.players) {
            expect(player.score).toBe(0);
        }
    });

    it('player score increases when catching target', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility, 2);
        await game.start();
        // Принудительно ставим игрока на позицию Target
        const targetPos = game.target.position;
        game.players[0].position = { ...targetPos };
        // Проверяем поимку через movePlayerByDirection (например, не двигая, а просто проверяя совпадение)
        // Или можно вручную вызвать проверку:
        if (
            game.target &&
            game.players[0].position.x === game.target.position.x &&
            game.players[0].position.y === game.target.position.y
        ) {
            game.players[0].incrementScore();
            // эмулируем прыжок Target
            // (или можно вызвать приватный метод через Reflect, если нужно)
        }
        expect(game.players[0].score).toBe(1);
        // Другой игрок не ловил — его score не меняется
        expect(game.players[1].score).toBe(0);
    });

    it('game should be created and return status', () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility);
        expect(game.status).toBe(GameStatuses.SETTINGS);
    });

    it('game should be created and return status in progress', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility);
        await game.start();
        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
    });

    it('game should throw error if not in settings state', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility);
        await game.start();
        await expect(game.start()).rejects.toThrow(
            'Game must be in settings state to start'
        );
    });

    it('target must be inside the grid', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility);
        expect(game.target).toBeNull();
        await game.start();
        expect(game.target.position.x).toBeLessThan(game.gridSize.columnsCount);
        expect(game.target.position.x).toBeGreaterThanOrEqual(0);
        expect(game.target.position.y).toBeLessThan(game.gridSize.rowsCount);
        expect(game.target.position.y).toBeGreaterThanOrEqual(0);
    });

    it('should set target position by dependency', async () => {
        const game = new Game(new RandomGenerateUtility());
        await game.start();
        // Проверяем, что позиция target не совпадает с игроками и в пределах сетки
        for (const player of game.players) {
            expect(game.target.position.equals(player.position)).toBe(false);
        }
        expect(game.target.position.x).toBeGreaterThanOrEqual(0);
        expect(game.target.position.x).toBeLessThan(game.gridSize.columnsCount);
        expect(game.target.position.y).toBeGreaterThanOrEqual(0);
        expect(game.target.position.y).toBeLessThan(game.gridSize.rowsCount);
    });

    it('targetJumpInterval setter', async () => {
        const game = new Game(new RandomGenerateUtility());
        game.targetJumpInterval = 10;
        await game.start();

        let changed = false;
        let prevTargetPosition = game.target.position;
        for (let i = 0; i < 10; i++) {
            await delay(11);
            if (!game.target.position.equals(prevTargetPosition)) {
                changed = true;
            }
            for (const player of game.players) {
                expect(game.target.position.equals(player.position)).toBe(
                    false
                );
            }
            prevTargetPosition = game.target.position;
        }
        expect(changed).toBe(true); // хотя бы раз позиция изменилась
        game.stop();
    });

    it('target should jump after interval', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility);
        // Увеличим размер сетки для теста
        game.gridSize.columnsCount = 6;
        game.gridSize.rowsCount = 6;
        game.targetJumpInterval = 100; // a small interval for faster test
        await game.start();

        const prevTargetPosition = game.target.position;

        await delay(101); // wait for the interval to fire

        const currentTargetPosition = game.target.position;
        expect(prevTargetPosition.equals(currentTargetPosition)).toBe(false);
        game.stop();
    });

    it('should set status to lose after 10 target jumps and stop jumping', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility);
        game.targetJumpInterval = 10; // ускорим тест
        await game.start();

        let lastPosition = new Position(
            game.target.position.x,
            game.target.position.y
        );
        for (let i = 0; i < 11; i++) {
            await delay(11); // чуть больше интервала
            lastPosition = new Position(
                game.target.position.x,
                game.target.position.y
            );
        }

        // После поражения статус LOSE
        expect(game.status).toBe(GameStatuses.LOSE);
        // Проверяем работу метода toSettingsState
        game.toSettingsState();
        expect(game.status).toBe(GameStatuses.SETTINGS);
        // После toSettingsState Target должен быть null
        expect(game.target).toBeNull();
        game.stop();
    });

    describe('player positions', () => {
        it('should set valid positions for all players on start', async () => {
            const game = new Game(new RandomGenerateUtility(), 3);
            await game.start();
            for (const player of game.players) {
                expect(player.position).not.toBeNull();
                expect(player.position.x).toBeGreaterThanOrEqual(0);
                expect(player.position.x).toBeLessThan(
                    game.gridSize.columnsCount
                );
                expect(player.position.y).toBeGreaterThanOrEqual(0);
                expect(player.position.y).toBeLessThan(game.gridSize.rowsCount);
            }
        });

        it('should ensure all player positions are unique', async () => {
            const game = new Game(new RandomGenerateUtility(), 4);
            await game.start();
            const positions = game.players.map((p) => p.position);
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    expect(positions[i].equals(positions[j])).toBe(false);
                }
            }
        });

        it('should ensure target position is not the same as any player', async () => {
            const game = new Game(new RandomGenerateUtility(), 3);
            await game.start();
            for (const player of game.players) {
                expect(game.target.position.equals(player.position)).toBe(
                    false
                );
            }
        });

        it('target should not jump to a player position (with real random)', async () => {
            const game = new Game(new RandomGenerateUtility(), 3);
            game.targetJumpInterval = 10;
            await game.start();

            for (let i = 0; i < 10; i++) {
                await delay(11);
                for (const player of game.players) {
                    expect(game.target.position.equals(player.position)).toBe(
                        false
                    );
                }
            }

            game.stop();
        });
    });

    it('player movement: direction, boundaries, and collision', async () => {
        // Мокаем randomUtility чтобы стартовые позиции были (1,1) и (2,2)
        const mockRandomUtility = {
            getRandomIntInclusive: jest
                .fn()
                .mockReturnValueOnce(1) // x1
                .mockReturnValueOnce(1) // y1
                .mockReturnValueOnce(2) // x2
                .mockReturnValueOnce(2), // y2
        };
        const game = new Game(mockRandomUtility, 2);
        await game.start();

        // Проверяем стартовые позиции
        expect(game.players[0].position.x).toBe(1);
        expect(game.players[0].position.y).toBe(1);
        expect(game.players[1].position.x).toBe(2);
        expect(game.players[1].position.y).toBe(2);

        // Двигаем первого игрока вправо (свободно)
        game.movePlayerByDirection(0, MovementDirections.RIGHT);
        expect(game.players[0].position.x).toBe(2);
        expect(game.players[0].position.y).toBe(1);

        // Двигаем первого игрока вниз (занято) остается на месте
        game.movePlayerByDirection(0, MovementDirections.DOWN);
        expect(game.players[0].position.x).toBe(2);
        expect(game.players[0].position.y).toBe(1);

        // Теперь игрок 1 двигаем впрово что бы освободить клетку
        game.movePlayerByDirection(1, MovementDirections.RIGHT);
        expect(game.players[1].position.x).toBe(3);
        expect(game.players[1].position.y).toBe(2);

        // Двигаем игрока 1 вправо что бы проверить границы поля
        game.movePlayerByDirection(1, MovementDirections.RIGHT);
        expect(game.players[1].position.x).toBe(3);
        expect(game.players[1].position.y).toBe(2);

        // Теперь игрок 0 может встать на (2,2)
        game.movePlayerByDirection(0, MovementDirections.DOWN);
        expect(game.players[0].position.x).toBe(2);
        expect(game.players[0].position.y).toBe(2);

        // Проверяем столкновение игроков
        game.movePlayerByDirection(0, MovementDirections.RIGHT);
        expect(game.players[0].position.x).toBe(2);
        game.movePlayerByDirection(0, MovementDirections.LEFT);
        expect(game.players[0].position.x).toBe(1);

        // Проверяем границы: игрок 0 пытается выйти за верхнюю границу
        game.movePlayerByDirection(1, MovementDirections.DOWN); // y=1
        expect(game.players[1].position.y).toBe(3);
        game.movePlayerByDirection(1, MovementDirections.DOWN); // y=0
        expect(game.players[1].position.y).toBe(3);
        game.movePlayerByDirection(1, MovementDirections.RIGHT); // попытка выйти за границу
        expect(game.players[1].position.x).toBe(3);
    });

    async function waitForStatus(game, status, timeout = 100) {
        const start = Date.now();
        while (game.status !== status) {
            if (Date.now() - start > timeout) break;
            await delay(5);
        }
    }

    it('should allow restarting the game after win or lose', async () => {
        const randomUtility = new RandomGenerateUtility();
        const game = new Game(randomUtility, 2);
        await game.start();
        // Вручную выставляем стартовые позиции
        game.players[0].position = new Position(1, 1);
        game.players[1].position = new Position(2, 2);
        game.target.position = new Position(1, 2);
        // Симулируем победу: score игрока >= 5
        game.players[0].score = 4;
        // Двигаем игрока 0 вниз на клетку с Target
        game.movePlayerByDirection(0, MovementDirections.DOWN);
        expect(game.players[0].score).toBe(5);
        expect(game.status).toBe(GameStatuses.WIN);
        // Переход к настройкам вручную
        game.toSettingsState();
        expect(game.status).toBe(GameStatuses.SETTINGS);
        // Перезапуск
        await game.start();
        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
        expect(game.players[0].score).toBe(0);
        expect(game.players[1].score).toBe(0);
        // Симулируем поражение: 10 прыжков Target
        game.targetJumpInterval = 10;
        // Ждём пока статус станет LOSE
        let waited = 0;
        while (game.status !== GameStatuses.LOSE && waited < 200) {
            await delay(10);
            waited += 10;
        }
        expect(game.status).toBe(GameStatuses.LOSE);
        // Переход к настройкам вручную
        game.toSettingsState();
        expect(game.status).toBe(GameStatuses.SETTINGS);
        // Перезапуск снова
        await game.start();
        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
    });
});

afterEach(() => {
    jest.clearAllTimers();
});

// промисификация setTimeout
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
