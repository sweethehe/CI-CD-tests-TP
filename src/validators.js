//* FONCTIONS VALIDATEURS

function isValidEmail(email) {
  if (typeof email !== 'string' || !email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const result = { valid: true, errors: [] };

  if (typeof password !== 'string' || !password) {
    result.valid = false;
    result.errors.push("Le mot de passe doit être une chaîne non vide");
    return result;
  }

  if (password.length < 8) {
    result.valid = false;
    result.errors.push("Minimum 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    result.valid = false;
    result.errors.push("Au moins 1 majuscule");
  }

  if (!/[a-z]/.test(password)) {
    result.valid = false;
    result.errors.push("Au moins 1 minuscule");
  }

  if (!/[0-9]/.test(password)) {
    result.valid = false;
    result.errors.push("Au moins 1 chiffre");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    result.valid = false;
    result.errors.push("Au moins 1 caractere special (!@#$%^&*)");
  }

  return result;
}

function isValidAge(age) {
  if (typeof age !== 'number') return false;
  if (!Number.isInteger(age)) return false;
  if (age < 0 || age > 150) return false;
  return true;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidAge,
};
