const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const authMiddleware= require('./middleware/auth');
const app = express();

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware for parsing JSON
app.use(express.json());

// Protect this route with the auth middleware
app.get('/protected-route', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'You are authenticated!', userId: req.auth.userId });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// Route handlers
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Static files middleware
app.use('/images', express.static(path.join(__dirname, 'images')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;

