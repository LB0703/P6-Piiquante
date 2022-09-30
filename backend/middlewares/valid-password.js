// Importing the "password" schema
const passwordSchema = require("../models/password");

// Check that the password respects the "password" scheme
module.exports = (req, res, next) => {
      // If the password is invalid
      if (!passwordSchema.validate(req.body.password)) { 
            res.status(400).json({message: "Veuillez choisir un mot de passe avec min 10 caractères,  une majuscule, une minuscule, un caractère spécial et au moins deux chiffres."});
      } else {
      // If the password is good, go to the next middleware
            next();
      }
};