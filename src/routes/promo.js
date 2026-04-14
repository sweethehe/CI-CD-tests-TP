const express = require("express");
const router = express.Router();
const { applyPromoCode } = require("../pricing.js");
const { promoCodes } = require("../data/data.js");

router.post("/validate", (req, res) => {
  try {
    const { promoCode, subtotal } = req.body;
    if (!promoCode) {
      return res.status(400).json({ error: "Promo code manquant" });
    }

    const originalSubtotal = subtotal;
    const newSubtotal = applyPromoCode(subtotal, promoCode, promoCodes);
    const discount = originalSubtotal - newSubtotal;

    res.status(200).json({
      valid: true,
      originalSubtotal: Number(originalSubtotal.toFixed(2)),
      newSubtotal: Number(newSubtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
    });
  } catch (e) {
    let status = 400;
    if (e.message.includes("inconnu")) {
      status = 404;
    }
    res.status(status).json({ error: e.message });
  }
});

module.exports = { router };
