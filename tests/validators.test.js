const { isValidEmail, isValidPassword, isValidAge } = require('../src/validators.js');

describe('E M A I L - V A L I D A T I O N - T E S T S', () => {
    it('should return true when a basic valid email is provided', () => {
        expect(isValidEmail("user@example.com")).toBe(true);
    });

    it('should return true when an email with tags and subdomains is provided', () => {
        expect(isValidEmail("user.name+tag@domain.co")).toBe(true);
    });

    it('should return false when a string without @ or domain is provided', () => {
        expect(isValidEmail("invalid")).toBe(false);
    });

    it('should return false when an email without username is provided', () => {
        expect(isValidEmail("@domain.com")).toBe(false);
    });

    it('should return false when an email without domain is provided', () => {
        expect(isValidEmail("user@")).toBe(false);
    });

    it('should return false when an empty string is provided', () => {
        expect(isValidEmail("")).toBe(false);
    });

    it('should return false when the input is null', () => {
        expect(isValidEmail(null)).toBe(false);
    });
});

describe('P A S S W O R D - V A L I D A T I O N - T E S T S', () => {
    it('should return valid true with no errors when a perfectly valid password is provided', () => {
        const result = isValidPassword("Passw0rd!");
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('should return valid false and multiple errors when the password is too short and missing requirements', () => {
        const result = isValidPassword("short");
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Minimum 8 caracteres");
        expect(result.errors).toContain("Au moins 1 majuscule");
        expect(result.errors).toContain("Au moins 1 chiffre");
        expect(result.errors).toContain("Au moins 1 caractere special (!@#$%^&*)");
    });

    it('should return valid false when the password does not contain an uppercase letter', () => {
        const result = isValidPassword("alllowercase1!");
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Au moins 1 majuscule");
    });

    it('should return valid false when the password does not contain a lowercase letter', () => {
        const result = isValidPassword("ALLUPPERCASE1!");
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Au moins 1 minuscule");
    });

    it('should return valid false when the password does not contain a digit', () => {
        const result = isValidPassword("NoDigits!here");
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Au moins 1 chiffre");
    });

    it('should return valid false when the password does not contain a special character', () => {
        const result = isValidPassword("NoSpecial1here");
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Au moins 1 caractere special (!@#$%^&*)");
    });

    it('should return valid false when the password is an empty string', () => {
        const result = isValidPassword("");
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return valid false when the password is null', () => {
        const result = isValidPassword(null);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

describe('A G E - V A L I D A T I O N - T E S T S', () => {
    it('should return true when a valid typical age is provided', () => {
        expect(isValidAge(25)).toBe(true);
    });

    it('should return true when the minimum valid boundary is provided', () => {
        expect(isValidAge(0)).toBe(true);
    });

    it('should return true when the maximum valid boundary is provided', () => {
        expect(isValidAge(150)).toBe(true);
    });

    it('should return false when a negative age is provided', () => {
        expect(isValidAge(-1)).toBe(false);
    });

    it('should return false when an age above the maximum boundary is provided', () => {
        expect(isValidAge(151)).toBe(false);
    });

    it('should return false when a non-integer number is provided', () => {
        expect(isValidAge(25.5)).toBe(false);
    });

    it('should return false when a string is provided instead of a number', () => {
        expect(isValidAge("25")).toBe(false);
    });

    it('should return false when the input is null', () => {
        expect(isValidAge(null)).toBe(false);
    });
});
