import { RandomGenerateUtility } from '../js/utility/randomNumberUtility';

describe('getRandomIntInclusive', () => {
    const utility = new RandomGenerateUtility();
    // 1. Корректные случаи
    test('генерирует число в диапазоне [1, 10]', () => {
        const result = utility.getRandomIntInclusive(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
    });

    test('работает с отрицательными числами [-5, 5]', () => {
        const result = utility.getRandomIntInclusive(-5, 5);
        expect(result).toBeGreaterThanOrEqual(-5);
        expect(result).toBeLessThanOrEqual(5);
    });

    test('корректно обрабатывает одинаковые границы [7, 7]', () => {
        expect(utility.getRandomIntInclusive(7, 7)).toBe(7);
    });

    test('округляет дробные границы [1.2, 3.9] => [2, 3]', () => {
        const result = utility.getRandomIntInclusive(1.2, 3.9);
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(3);
    });

    // 2. Проверка ошибок
    test('выбрасывает ошибку если min > max', () => {
        expect(() => utility.getRandomIntInclusive(10, 1)).toThrow(
            'min must be less than or equal to max'
        );
    });

    test('выбрасывает ошибку при нечисловых аргументах', () => {
        expect(() => utility.getRandomIntInclusive('1', 10)).toThrow(
            'Arguments must be numbers'
        );
        expect(() => utility.getRandomIntInclusive(1, '10')).toThrow(
            'Arguments must be numbers'
        );
        expect(() => utility.getRandomIntInclusive(null, 10)).toThrow(
            'Arguments must be numbers'
        );
    });

    test('выбрасывает ошибку при NaN/Infinity', () => {
        expect(() => utility.getRandomIntInclusive(NaN, 10)).toThrow(
            'Arguments must be finite numbers'
        );
        expect(() => utility.getRandomIntInclusive(1, Infinity)).toThrow(
            'Arguments must be finite numbers'
        );
    });
});
