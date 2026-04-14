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

function calculateSurge(hour, dayOfWeek) {
  let h = hour;
  if (typeof hour === 'string') {
    const parts = hour.toLowerCase().replace('h', ':').split(':');
    h = parseInt(parts[0], 10) + (parseInt(parts[1] || 0, 10) / 60);
  }
  
  if (h < 10 || h >= 22) return 0; // fermé
  
  const day = dayOfWeek.toLowerCase().trim();
  
  if (day === 'dimanche') return 1.2;
  
  if (['vendredi', 'samedi'].includes(day)) {
    if (h >= 19 && h < 22) return 1.8;
    return 1.0;
  }
  
  if (['lundi', 'mardi', 'mercredi', 'jeudi'].includes(day)) {
    if (h >= 12 && h < 13.5) return 1.3;
    if (h >= 19 && h < 21) return 1.5;
    return 1.0;
  }
  
  return 1.0;
}

module.exports = {
  calculateDeliveryFee,
  applyPromoCode,
  calculateSurge,
};