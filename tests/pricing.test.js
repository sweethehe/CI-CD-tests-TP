const { calculateDeliveryFee } = require('../src/pricing.js');

describe('T A R I F I C A T I O N - T E S T S', () => {

    // Cas normaux
    describe('Cas normaux', () => {
        it('should return base fee for 2 km, 1 kg', () => {
            expect(calculateDeliveryFee(2, 1)).toBe(2.00);
        });

        it('should return 4.00 for 7 km, 3 kg', () => {
            expect(calculateDeliveryFee(7, 3)).toBe(4.00);
        });

        it('should return 4.50 for 5 km, 8 kg (heavy)', () => {
            expect(calculateDeliveryFee(5, 8)).toBe(4.50);
        });
    });

    // Cas limites
    describe('Cas limites', () => {
        it('should not apply distance supplement for exactly 3 km', () => {
            expect(calculateDeliveryFee(3, 1)).toBe(2.00);
        });

        it('should accept delivery and calculate max distance fee for exactly 10 km', () => {
            expect(calculateDeliveryFee(10, 1)).toBe(5.50);
        });

        it('should not apply weight supplement for exactly 5 kg', () => {
            expect(calculateDeliveryFee(2, 5)).toBe(2.00);
        });
    });

    // Cas d'erreur
    describe("Cas d'erreur", () => {
        it('should refuse delivery (return null) for 15 km', () => {
            expect(calculateDeliveryFee(15, 1)).toBeNull();
        });

        it('should throw an error for negative distance', () => {
            expect(() => calculateDeliveryFee(-1, 1)).toThrow("La distance et le poids ne peuvent pas être négatifs");
        });

        it('should throw an error for negative weight', () => {
             expect(() => calculateDeliveryFee(1, -1)).toThrow("La distance et le poids ne peuvent pas être négatifs");
        });

        it('should be valid for distance = 0', () => {
            expect(calculateDeliveryFee(0, 1)).toBe(2.00);
        });
    });

    // Calculs precis
    describe('Calculs precis', () => {
        it('should calculate precisely 3.50 for 6 km, 2 kg', () => {
            expect(calculateDeliveryFee(6, 2)).toBe(3.50);
        });

        it('should calculate precisely 7.00 for 10 km, 6 kg', () => {
            expect(calculateDeliveryFee(10, 6)).toBe(7.00);
        });
    });
});
