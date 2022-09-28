// Importing mongoose and mongoose-unique-validator
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creating user schema, Using mongoose-unique-validator to avoid having more than one user with a specific email adress
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
// Applying the validator to the user schema
userSchema.plugin(uniqueValidator);

// Exporting user schema as model
module.exports = mongoose.model('User', userSchema);