function calculateDeliveryFee(distance, weight) {
  if (distance < 0 || weight < 0) {
    throw new Error("La distance et le poids ne peuvent pas être négatifs");
  }
  
  if (distance > 10) {
    return null;
  }

  let final_fee = 2.00;

  if (distance > 3) {
    final_fee += (distance - 3) * 0.50;
  }

  if (weight > 5) {
    final_fee += 1.50;
  }

  return final_fee;
}

function applyPromoCode(subtotal, promoCode, promoCodes) {
  if (subtotal < 0) {
    throw new Error("Le sous-total ne peut pas être négatif");
  }

  if (!promoCode) {
    return subtotal;
  }

  const promo = promoCodes.find(p => p.code === promoCode);
  if (!promo) {
    throw new Error("Code promo inconnu");
  }

  const today = new Date().toISOString().split('T')[0];
  if (promo.expiresAt < today) {
    throw new Error("Code promo expiré");
  }

  if (subtotal < promo.minOrder) {
    throw new Error("Commande sous le minOrder");
  }

  let finalPrice = subtotal;

  if (promo.type === 'percentage') {
    finalPrice = subtotal - (subtotal * (promo.value / 100));
  } else if (promo.type === 'fixed') {
    finalPrice = subtotal - promo.value;
  }

  return Math.max(0, finalPrice);
}

module.exports = {
  calculateDeliveryFee,
  applyPromoCode,
};