const { calculateDeliveryFee, applyPromoCode, calculateSurge, calculateOrderTotal } = require('../src/pricing.js');

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

    describe('Couverture manquante Surge', () => {
        it('devrait retourner 1.0 (normal) un vendredi hors heure de pointe (ex: 15h)', () => {
            expect(calculateSurge("15h00", "vendredi")).toBe(1.0);
        });

        it('devrait retourner 1.0 par défaut pour un jour inconnu', () => {
            expect(calculateSurge("15h00", "pluton")).toBe(1.0);
        });
    });
});

describe('O R D E R - T O T A L - T E S T S', () => {
    const mockOrderPromos = [
        { code: "PERCENT20", type: "percentage", value: 20, minOrder: 10.00, expiresAt: "2099-12-31" }
    ];

    describe('Scenario complet', () => {
        it('should correctly calculate total without promo (mardi 15h)', () => {
            const items = [{ name: "Pizza", price: 12.50, quantity: 2 }];
            const result = calculateOrderTotal(items, 5, 1, null, mockOrderPromos, "15h00", "mardi");
            expect(result).toEqual({
                subtotal: 25.00,
                discount: 0.00,
                deliveryFee: 3.00,
                surge: 1.00,
                total: 28.00
            });
        });

        it('should correctly calculate total with a 20% promo code (mardi 15h)', () => {
            const items = [{ name: "Pizza", price: 12.50, quantity: 2 }];
            const result = calculateOrderTotal(items, 5, 1, "PERCENT20", mockOrderPromos, "15h00", "mardi");
            expect(result).toEqual({
                subtotal: 25.00,
                discount: 5.00,
                deliveryFee: 3.00,
                surge: 1.00,
                total: 23.00
            });
        });

        it('should correctly calculate total with surge pricing (vendredi 20h)', () => {
            const items = [{ name: "Pizza", price: 12.50, quantity: 2 }];
            const result = calculateOrderTotal(items, 5, 1, null, mockOrderPromos, "20h00", "vendredi");
            expect(result).toEqual({
                subtotal: 25.00,
                discount: 0.00,
                deliveryFee: 5.40,
                surge: 1.80,
                total: 30.40
            });
        });
    });

    describe('Cas qui cassent', () => {
        it('should throw an error for an empty cart', () => {
            expect(() => calculateOrderTotal([], 5, 1, null, mockOrderPromos, "15h00", "mardi")).toThrow("Le panier est vide");
        });

        it('should throw an error for an item with quantity 0', () => {
            const items = [{ name: "Pizza", price: 12.50, quantity: 0 }];
            expect(() => calculateOrderTotal(items, 5, 1, null, mockOrderPromos, "15h00", "mardi")).toThrow("La quantité d'un article doit être supérieure à 0");
        });

        it('should throw an error for an item with negative price', () => {
            const items = [{ name: "Pizza", price: -12.50, quantity: 2 }];
            expect(() => calculateOrderTotal(items, 5, 1, null, mockOrderPromos, "15h00", "mardi")).toThrow("Le prix d'un article ne peut pas être négatif");
        });

        it('should throw an error when ordering at 23h (closed)', () => {
            const items = [{ name: "Pizza", price: 12.50, quantity: 2 }];
            expect(() => calculateOrderTotal(items, 5, 1, null, mockOrderPromos, "23h00", "mardi")).toThrow("L'établissement est fermé à cette heure-là");
        });

        it('should throw an error when distance is out of bounds (15km)', () => {
            const items = [{ name: "Pizza", price: 12.50, quantity: 2 }];
            expect(() => calculateOrderTotal(items, 15, 1, null, mockOrderPromos, "15h00", "mardi")).toThrow("La distance de livraison est trop importante");
        });
    });

    describe('Verification mathematique', () => {
        it('should mathematically match subtotal + deliveryFee = total without promo', () => {
            const items = [{ name: "Pasta", price: 10, quantity: 3 }];
            const result = calculateOrderTotal(items, 6, 2, null, mockOrderPromos, "20h00", "jeudi");
            expect(result.subtotal + result.deliveryFee).toBeCloseTo(result.total);
            expect(result.discount).toBe(0);
        });

        it('should strictly apply surge only to delivery fee, not the subtotal', () => {
            const items = [{ name: "Salad", price: 10, quantity: 1 }];
            const result = calculateOrderTotal(items, 3, 1, null, mockOrderPromos, "21h00", "vendredi");
            expect(result.subtotal).toBe(10.00);
            expect(result.deliveryFee).toBe(3.60);
            expect(result.surge).toBe(1.80);
            expect(result.total).toBe(13.60);
        });
    });
});
