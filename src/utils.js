//* FONCTIONS UTILITAIRES

function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0 || str === '' || str === null) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / numbers.length).toFixed(2));
}

function slugify(text) {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sortStudents(students, sortBy, order = "asc") {
  if (!students || students.length === 0) return [];
  
  const copiedStudents = [...students];

  return copiedStudents.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "grade") {
      comparison = a.grade - b.grade;
    } else if (sortBy === "age") {
      comparison = a.age - b.age;
    }
    
    return order === "desc" ? -comparison : comparison;
  });
}

module.exports = {
  capitalize,
  calculateAverage,
  slugify,
  clamp,
  sortStudents,
};