const request = require('supertest');
const { capitalize, calculateAverage, slugify, clamp } = require('../src/utils.js');

// Tests Capitalize
describe('C A P I T A L I Z E - T E S T S', () => {
    it('should capitalize the first letter and lowercase the rest when a generic string is provided', async () => {
       const str = "hello";
       const result = capitalize(str);
       expect(result).toBe("Hello");
    });

    it('should capitalize only the first letter when an all-uppercase string is provided', async () => {
        const str = "HELLO";
        const result = capitalize(str);
        expect(result).toBe('Hello');
    });

    it('should return an empty string when an empty string is provided', async () => {
        const str = "";
        const result = capitalize(str);
        expect(result).toBe('');
    });

    it('should return an empty string when the input is null', async () => {
        const str = null;
        const result = capitalize(str);
        expect(result).toBe('');
    });
});

// Tests Calculate Average
describe('C A L C U L A T E - A V E R A G E - T E S T S', () => {
    it('should return the average when a normal list of numbers is provided', async () => {
       const numbers = [10, 12, 14];
       const result = calculateAverage(numbers);
       expect(result).toBe(12);
    });

    it('should return the number when a list containing only one number is provided', async () => {
        const numbers = [15];
        const result = calculateAverage(numbers);
        expect(result).toBe(15);
    });

    it('should return 0 when an empty list is provided', async () => {
        const numbers = [];
        const result = calculateAverage(numbers);
        expect(result).toBe(0);
    });

    it('should return the correct average when another list of numbers is provided', async () => {
        const numbers = [10, 11, 12];
        const result = calculateAverage(numbers);
        expect(result).toBe(11);
    });

    it('should return 0 when the input is null', async () => {
        const numbers = null;
        const result = calculateAverage(numbers);
        expect(result).toBe(0);
    });
});

// Tests Slugify
describe('S L U G I F Y - T E S T S', () => {
    it('should return a slugified string when a string with spaces is provided', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should return a slugified string without spacing when a string with leading and trailing spaces is provided', () => {
        expect(slugify(' Spaces Everywhere ')).toBe('spaces-everywhere');
    });

    it("should return a slugified string without special characters when a string with special characters is provided", () => {
        expect(slugify("C'est l'ete !")).toBe('cest-lete');
    });

    it('should return an empty string when an empty string is provided', () => {
        expect(slugify('')).toBe('');
    });

    it('should return an empty string when the input is null', () => {
        expect(slugify(null)).toBe('');
    });
});

// Tests Clamp
describe('C L A M P - T E S T S', () => {
    it('should return the value when it is within the specified range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return the minimum boundary when the value is a negative number below the specified range', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return the maximum boundary when the value is above the specified range', () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should return 0 when both boundaries and value are 0', () => {
        expect(clamp(0, 0, 0)).toBe(0);
    });

    it('should return the minimum boundary when the value is null', () => {
        expect(clamp(null, 5, 10)).toBe(5);
    });
});