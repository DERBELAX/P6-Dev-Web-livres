const bcrypt = require('bcrypt'); // Hacher les mots de passe
const jwt = require('jsonwebtoken');// Générer des tokens JWT
const User = require('../models/User'); // Importation du modèle User

// Contrôleur pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
      // Hachage du mot de passe avec un "salt" de 10 tours
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash
            });
             // Sauvegarde de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'User created!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Contrôleur pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            // Comparaison du mot de passe entré avec celui stocké (haché) dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Invalid email or password' });
                    }
                    // Si l'authentification réussit, générer un token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};