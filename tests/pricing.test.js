const { calculateDeliveryFee, applyPromoCode, calculateSurge } = require('../src/pricing.js');

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

const mockPromoCodes = [
  { code: "PERCENT20", type: "percentage", value: 20, minOrder: 15.00, expiresAt: "2099-12-31" },
  { code: "FIXED5", type: "fixed", value: 5, minOrder: 10.00, expiresAt: "2099-12-31" },
  { code: "FIXED10", type: "fixed", value: 10, minOrder: 0.00, expiresAt: "2099-12-31" },
  { code: "PERCENT100", type: "percentage", value: 100, minOrder: 0.00, expiresAt: "2099-12-31" },
  { code: "EXPIRED", type: "fixed", value: 5, minOrder: 10.00, expiresAt: "2000-01-01" },
];

describe('P R O M O - C O D E - T E S T S', () => {

    describe('Cas normaux', () => {
        it('should correctly apply a percentage code (20% off 50 = 40)', () => {
            expect(applyPromoCode(50, "PERCENT20", mockPromoCodes)).toBe(40.00);
        });

        it('should correctly apply a fixed code (5 off 30 = 25)', () => {
            expect(applyPromoCode(30, "FIXED5", mockPromoCodes)).toBe(25.00);
        });

        it('should successfully apply a code when the minimum order is strictly met', () => {
            expect(applyPromoCode(15, "PERCENT20", mockPromoCodes)).toBe(12.00);
        });
    });

    describe('Refus du code', () => {
        it('should throw an error if the promo code is expired', () => {
            expect(() => applyPromoCode(50, "EXPIRED", mockPromoCodes)).toThrow("Code promo expiré");
        });

        it('should throw an error if the order is strictly below the minimum required', () => {
             expect(() => applyPromoCode(14.99, "PERCENT20", mockPromoCodes)).toThrow("Commande sous le minOrder");
        });

        it('should throw an error if the code does not exist in the list', () => {
            expect(() => applyPromoCode(50, "UNKNOWN", mockPromoCodes)).toThrow("Code promo inconnu");
        });
    });

    describe('Cas limites dangereux', () => {
        it('should not return a negative total if fixed code value exceeds subtotal', () => {
            expect(applyPromoCode(5, "FIXED10", mockPromoCodes)).toBe(0);
        });

        it('should completely zero out the total if a 100% percentage code is applied', () => {
            expect(applyPromoCode(50, "PERCENT100", mockPromoCodes)).toBe(0);
        });

        it('should allow valid promo codes on an empty order (subtotal = 0)', () => {
             expect(applyPromoCode(0, "FIXED10", mockPromoCodes)).toBe(0);
        });

        it('should accept a promo code that expires exactly today', () => {
            const todayDateString = new Date().toISOString().split('T')[0];
            const dynamicPromos = [
                { code: "TODAY", type: "fixed", value: 5, minOrder: 0.00, expiresAt: todayDateString }
            ];
            expect(applyPromoCode(50, "TODAY", dynamicPromos)).toBe(45);
        });
    });

    describe('Entrees invalides', () => {
        it('should return raw subtotal without applying discount if promo code is null', () => {
            expect(applyPromoCode(50, null, mockPromoCodes)).toBe(50);
        });

        it('should return raw subtotal without applying discount if promo code is empty string', () => {
            expect(applyPromoCode(50, "", mockPromoCodes)).toBe(50);
        });

        it('should throw an error if the provided subtotal is negative', () => {
            expect(() => applyPromoCode(-5, "PERCENT20", mockPromoCodes)).toThrow("Le sous-total ne peut pas être négatif");
        });
    });
});

describe('S U R G E - P R I C I N G - T E S T S', () => {
    describe('Chaque multiplicateur', () => {
        it('should return 1.0 (normal) for Mardi 15h', () => {
            expect(calculateSurge("15h00", "mardi")).toBe(1.0);
        });

        it('should return 1.3 (dejeuner) for Mercredi 12h30', () => {
            expect(calculateSurge("12:30", "mercredi")).toBe(1.3);
        });

        it('should return 1.5 (diner) for Jeudi 20h', () => {
            expect(calculateSurge("20h00", "jeudi")).toBe(1.5);
        });

        it('should return 1.8 (weekend soir) for Vendredi 21h', () => {
            expect(calculateSurge("21h00", "vendredi")).toBe(1.8);
        });

        it('should return 1.2 (dimanche) for Dimanche 14h', () => {
            // Also tests numeric hour parsing here
            expect(calculateSurge(14, "dimanche")).toBe(1.2);
        });
    });

    describe('Transitions et limites', () => {
        it('should return 1.0 (normal) at exactly 11h30 before lunch starts', () => {
            expect(calculateSurge("11h30", "mardi")).toBe(1.0);
        });

        it('should return 1.5 (diner) at exactly 19h00', () => {
            expect(calculateSurge("19:00", "lundi")).toBe(1.5);
        });

        it('should return 0 (ferme) at exactly 22h00', () => {
             expect(calculateSurge("22h00", "mercredi")).toBe(0);
        });

        it('should return 0 (ferme) at 9h59', () => {
            expect(calculateSurge("09:59", "vendredi")).toBe(0);
        });

        it('should return 1.0 (ouvert) at exactly 10h00', () => {
            expect(calculateSurge("10h00", "jeudi")).toBe(1.0);
        });
    });
});
