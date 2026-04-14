const express = require('express');

// On initialise l'application Express
const app = express();

// On dit à Express de comprendre le format JSON
app.use(express.json());

// On exporte l'application pour pouvoir l'utiliser dans d'autres fichiers
module.exports = app;