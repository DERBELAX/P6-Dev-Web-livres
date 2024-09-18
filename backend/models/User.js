const mongoose = require ('mongoose');
// Importation du plugin mongoose-unique-validator pour valider les champs uniques
const uniqueValidator = require('mongoose-unique-validator')

// Définition du schéma de données pour un utilisateur
const userSchema = mongoose.Schema({
    email :{ type: String, required: true, unique : true},
    password :{type:String, required: true}
});
// Application du plugin uniqueValidator au schéma pour garantir l'unicité des emails
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);