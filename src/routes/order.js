const express = require("express");
const router = express.Router();
const { calculateOrderTotal } = require("../pricing.js");
const { promoCodes } = require("../data/data.js");

let orders = [];

function resetOrders() {
    orders = [];
}

router.post("/simulate", (req, res) => {
    try {
        const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
        const result = calculateOrderTotal(
            items,
            distance,
            weight,
            promoCode,
            promoCodes,
            hour,
            dayOfWeek,
        );
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.post("/", (req, res) => {
    try {
        const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
        const result = calculateOrderTotal(
            items,
            distance,
            weight,
            promoCode,
            promoCodes,
            hour,
            dayOfWeek,
        );

        const newId =
      orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
        const newOrder = {
            id: newId,
            items,
            distance,
            weight,
            promoCode,
            hour,
            dayOfWeek,
            ...result,
        };
        orders.push(newOrder);

        res.status(201).json(newOrder);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const order = orders.find((o) => o.id === id);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
});

module.exports = {
    router,
    resetOrders,
};
