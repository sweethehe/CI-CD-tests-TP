const request = require('supertest');
const { capitalize, calculateAverage, slugify, clamp } = require('../src/utils.js');

// Tests Capitalize
describe('C A P I T A L I Z E - T E S T S', () => {
    it ('1. normal case', async () => {
       const str = "hello";
       const result = capitalize(str);
       expect(result).toBe("Hello");
    });

    it ('2. All capitalize case', async () => {
        const str = "HELLO";
        const result = capitalize(str);
        expect(result).toBe('Hello');
    });

    it('3. empty string case', async () => {
        const str = "";
        const result = capitalize(str);
        expect(result).toBe('');
    });

    it('3. null case', async () => {
        const str = null;
        const result = capitalize(str);
        expect(result).toBe('');
    });
});

// Tests Calculate Average
describe('C A L C U L A T E - A V E R A G E - T E S T S', () => {
    it ('1. normal case', async () => {
       const numbers = [10, 12, 14];
       const result = calculateAverage(numbers);
       expect(result).toBe(12);
    });

    it ('2. One number in list case', async () => {
        const numbers = [15];
        const result = calculateAverage(numbers);
        expect(result).toBe(15);
    });

    it('3. empty list case', async () => {
        const numbers = [];
        const result = calculateAverage(numbers);
        expect(result).toBe(0);
    });

    it('4. normal case 2', async () => {
        const numbers = [10, 11, 12];
        const result = calculateAverage(numbers);
        expect(result).toBe(11);
    });

    it('5. null case', async () => {
        const numbers = null;
        const result = calculateAverage(numbers);
        expect(result).toBe(0);
    });
});

// Tests Slugify
describe('S L U G I F Y - T E S T S', () => {
    it('1. Hello World case', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });

    it('2. Spaces everywhere case', () => {
        expect(slugify(' Spaces Everywhere ')).toBe('spaces-everywhere');
    });

    it("3. Special characters case (C'est l'ete !)", () => {
        expect(slugify("C'est l'ete !")).toBe('cest-lete');
    });

    it('4. empty string case', () => {
        expect(slugify('')).toBe('');
    });
});

// Tests Clamp
describe('C L A M P - T E S T S', () => {
    it('1. within range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('2. below range', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('3. above range', () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });

    it('4. zero range', () => {
        expect(clamp(0, 0, 0)).toBe(0);
    });
});