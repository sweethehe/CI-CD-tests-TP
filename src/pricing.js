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

module.exports = {
  calculateDeliveryFee,
};