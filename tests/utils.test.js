const request = require('supertest');
const { capitalize, calculateAverage, slugify, clamp, sortStudents } = require('../src/utils.js');

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

// Tests Sort Students
describe('S O R T - S T U D E N T S - T E S T S', () => {
    const defaultStudents = [
        { name: "Charlie", grade: 90, age: 21 },
        { name: "Alice", grade: 80, age: 20 },
        { name: "Bob", grade: 60, age: 22 }
    ];

    it('1. should sort students by grade ascending', () => {
        const expected = [
            { name: "Bob", grade: 60, age: 22 },
            { name: "Alice", grade: 80, age: 20 },
            { name: "Charlie", grade: 90, age: 21 }
        ];
        expect(sortStudents(defaultStudents, "grade", "asc")).toEqual(expected);
    });

    it('2. should sort students by grade descending', () => {
        const expected = [
            { name: "Charlie", grade: 90, age: 21 },
            { name: "Alice", grade: 80, age: 20 },
            { name: "Bob", grade: 60, age: 22 }
        ];
        expect(sortStudents(defaultStudents, "grade", "desc")).toEqual(expected);
    });

    it('3. should sort students by name ascending', () => {
        const expected = [
            { name: "Alice", grade: 80, age: 20 },
            { name: "Bob", grade: 60, age: 22 },
            { name: "Charlie", grade: 90, age: 21 }
        ];
        expect(sortStudents(defaultStudents, "name", "asc")).toEqual(expected);
    });

    it('4. should sort students by age ascending', () => {
        const expected = [
            { name: "Alice", grade: 80, age: 20 },
            { name: "Charlie", grade: 90, age: 21 },
            { name: "Bob", grade: 60, age: 22 }
        ];
        expect(sortStudents(defaultStudents, "age", "asc")).toEqual(expected);
    });

    it('5. should return empty array for null input', () => {
        expect(sortStudents(null, "grade", "asc")).toEqual([]);
    });

    it('6. should return empty array for empty input', () => {
        expect(sortStudents([], "grade", "asc")).toEqual([]);
    });

    it('7. should not modify the original array', () => {
        const original = [
            { name: "Charlie", grade: 90, age: 21 },
            { name: "Alice", grade: 80, age: 20 }
        ];
        const copy = [...original];
        sortStudents(original, "name", "asc");
        expect(original).toEqual(copy);
    });

    it('8. should default to ascending order', () => {
        const expected = [
            { name: "Bob", grade: 60, age: 22 },
            { name: "Alice", grade: 80, age: 20 },
            { name: "Charlie", grade: 90, age: 21 }
        ];
        // Appel sans le 3e parametre (order)
        expect(sortStudents(defaultStudents, "grade")).toEqual(expected);
    });
});