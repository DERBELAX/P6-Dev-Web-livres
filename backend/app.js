// Importation des modules nécessaires
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const authMiddleware= require('./middleware/auth')
const app = express();

// Connexion à MongoDB avec Mongoose en utilisant les informations d'URI stockées dans un fichier .env
mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware CORS pour gérer les autorisations cross-origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise l'accès depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Spécifie les en-têtes autorisés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Spécifie les méthodes HTTP autorisées
    next();
});

// Middleware pour parser les requêtes en JSON
app.use(express.json());

// Déclaration des routes principales
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Middleware pour servir des fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware pour la gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Exportation de l'application
module.exports = app;

