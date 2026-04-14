const request = require('supertest');
const app = require('../src/app.js');
const { resetOrders } = require('../src/routes/order.js');

describe('API INTÉGRATION TESTS', () => {

    beforeEach(() => {
        // Reset de la base de données fantôme avant chaque test pour éviter la contamination
        resetOrders();
    });

    describe('POST /orders/simulate (7 tests min)', () => {
        it('1. devrais renvoyer 200 et les détails pour une commande normale sans promo', async () => {
            const body = {
                items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                distance: 5, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "mardi"
            };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("total");
            expect(response.body.subtotal).toBe(25.0);
            expect(response.body.deliveryFee).toBe(3.0);
        });

        it('2. devrais appliquer la réduction et renvoyer 200 pour un code promotionnel valide', async () => {
            const body = {
                items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                distance: 5, weight: 1, promoCode: "PERCENT20", hour: "15:00", dayOfWeek: "mardi"
            };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(200);
            expect(response.body.discount).toBe(5.0);
            expect(response.body.total).toBe(23.0);
        });

        it('3. devrais renvoyer 400 pour un code promotionnel expiré', async () => {
            const body = {
                items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                distance: 5, weight: 1, promoCode: "EXPIRED", hour: "15:00", dayOfWeek: "mardi"
            };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Code promo expiré");
        });

        it('4. devrais renvoyer 400 si le panier est complètement vide', async () => {
            const body = { items: [], distance: 5, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "mardi" };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Le panier est vide");
        });

        it('5. devrais renvoyer 400 si la livraison est hors zone (ex: 15km)', async () => {
            const body = {
                items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                distance: 15, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "mardi"
            };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("La distance de livraison est trop importante");
        });

        it('6. devrais renvoyer 400 si la commande est passée quand c est fermé (23h)', async () => {
            const body = {
                items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                distance: 5, weight: 1, promoCode: null, hour: "23:00", dayOfWeek: "mardi"
            };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("L'établissement est fermé à cette heure-là");
        });

        it('7. devrais avoir un deliveryFee bien multiplié pendant un pic de Surge (vendredi 20h)', async () => {
            const body = {
                items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
                distance: 5, weight: 1, promoCode: null, hour: "20:00", dayOfWeek: "vendredi" // Surge = 1.8
            };
            const response = await request(app).post('/orders/simulate').send(body);
            expect(response.status).toBe(200);
            expect(response.body.surge).toBe(1.8);
            expect(response.body.deliveryFee).toBe(5.4); // 3 * 1.8
        });
    });

    describe('POST /orders (5 tests min)', () => {
        it('1. devrais renvoyer 201 et lier un nouvel ID pour une commande valide', async () => {
            const body = {
                items: [{ name: "Salade", price: 10, quantity: 1 }],
                distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi"
            };
            const response = await request(app).post('/orders').send(body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body.id).toBe(1);
        });

        it('2. devrais retrouver la même commande que celle fraichement postée via GET /orders/:id', async () => {
            const body = {
                items: [{ name: "Salade", price: 10, quantity: 1 }],
                distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi"
            };
            const postResponse = await request(app).post('/orders').send(body);
            const newId = postResponse.body.id;

            const getResponse = await request(app).get(`/orders/${newId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body.id).toBe(newId);
            expect(getResponse.body.total).toBe(postResponse.body.total);
        });

        it('3. devrais assigner deux IDs bel et bien différents pour deux commandes passées de suite', async () => {
            const body = { items: [{ name: "Salade", price: 10, quantity: 1 }], distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi" };
            const post1 = await request(app).post('/orders').send(body);
            const post2 = await request(app).post('/orders').send(body);

            expect(post1.body.id).not.toBe(post2.body.id);
            expect(post1.body.id).toBe(1);
            expect(post2.body.id).toBe(2);
        });

        it('4. devrais renvoyer 400 et planter l enregistrement de la commande si celle-ci est invalide', async () => {
            const body = { items: [], distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi" };
            const response = await request(app).post('/orders').send(body);
            expect(response.status).toBe(400);
        });

        it('5. devrais bien empêcher qu\'une commande invalide s\'enregistre dans la memoire fantome', async () => {
            const validBody = { items: [{ name: "Salade", price: 10, quantity: 1 }], distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi" };
            const invalidBody = { items: [], distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi" };
             
            await request(app).post('/orders').send(validBody); // ID 1
            await request(app).post('/orders').send(invalidBody); // Doit planter

            // L'id 2 de l'invalidBody n'a pas été enregistré. Donc un GET sur /orders/2 doit faire 404
            const getResponse = await request(app).get('/orders/2');
            expect(getResponse.status).toBe(404);
        });
    });

    describe('GET /orders/:id (3 tests min)', () => {
        it('1. devrais renvoyer 200 en ciblant un ID existant', async () => {
            const body = { items: [{ name: "A", price: 10, quantity: 1 }], distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi" };
            const postResponse = await request(app).post('/orders').send(body);
            const getResponse = await request(app).get(`/orders/${postResponse.body.id}`);
            expect(getResponse.status).toBe(200);
        });

        it('2. devrais renvoyer 404 lors de la tentative de fetch pour un ID inexistant', async () => {
            const getResponse = await request(app).get('/orders/999');
            expect(getResponse.status).toBe(404);
            expect(getResponse.body.error).toBe("Order not found");
        });

        it('3. devrais renvoyer une structure complète et conforme', async () => {
            const body = { items: [{ name: "A", price: 10, quantity: 1 }], distance: 2, weight: 1, promoCode: null, hour: "15:00", dayOfWeek: "lundi" };
            const postResponse = await request(app).post('/orders').send(body);
            const getResponse = await request(app).get(`/orders/${postResponse.body.id}`);
            expect(getResponse.body).toHaveProperty("id");
            expect(getResponse.body).toHaveProperty("items");
            expect(getResponse.body).toHaveProperty("subtotal");
            expect(getResponse.body).toHaveProperty("total");
            expect(getResponse.body).toHaveProperty("distance");
        });
    });

    describe('POST /promo/validate (5 tests min)', () => {
        it('1. devrais renvoyer 200 et les détails en donnant un code promo valide', async () => {
            const response = await request(app).post('/promo/validate').send({
                promoCode: "PERCENT20",
                subtotal: 50
            });
            expect(response.status).toBe(200);
            expect(response.body.valid).toBe(true);
            expect(response.body.newSubtotal).toBe(40.0); // 20% off 50
        });

        it('2. devrais renvoyer 400 et la cause si le code a expiré', async () => {
            const response = await request(app).post('/promo/validate').send({
                promoCode: "EXPIRED",
                subtotal: 50
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Code promo expiré");
        });

        it('3. devrais renvoyer 400 et la cause si le total est inférieur au minOrder exigé', async () => {
            const response = await request(app).post('/promo/validate').send({
                promoCode: "PERCENT20",
                subtotal: 5 // Min required is 10
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Commande sous le minOrder");
        });

        it('4. devrais renvoyer 404 (et non 400) si le master code promo est introuvable', async () => {
            const response = await request(app).post('/promo/validate').send({
                promoCode: "DONOTEXIST",
                subtotal: 50
            });
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Code promo inconnu");
        });

        it('5. devrais renvoyer 400 si aucun code n est envoyé dans la Payload', async () => {
            const response = await request(app).post('/promo/validate').send({ subtotal: 50 });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Promo code manquant");
        });
    });
});
