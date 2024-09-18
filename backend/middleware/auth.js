const jwt = require('jsonwebtoken');
// Exportation d'un middleware qui vérifiera si une requête est authentifiée
module.exports = (req, res, next) => {
    try {
        // Récupération du token depuis les en-têtes HTTP 
        const token = req.headers.authorization.split(' ')[1]; 
       // Décodage du token en utilisant le secret stocké dans les variables d'environnement
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); 
        // Extraction de l'ID de l'utilisateur à partir du token décodé
        const userId = decodedToken.userId;
        // Ajout de l'ID de l'utilisateur à l'objet de la requête pour les futures opérations
        req.auth = { userId: userId };
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized request!' });
    }
};