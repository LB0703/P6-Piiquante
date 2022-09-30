// Importing the passwordValidator package
const passwordValidator = require("password-validator");
	
// Create a schema
const passwordSchema = new passwordValidator();

// Add properties to it 
passwordSchema
.is().min(10)                                     // Must contain at least 10 characters
.is().max(100)                                    // Must contain a maximum of 100 characters
.has().uppercase()                                // Must contain capital letters
.has().lowercase()                                // Must contain lowercase letters
.has().digits(2)                                  // Must contain at least 2 digits
.has().symbols(1)                                // Must contain at least one symbol
.has().not().spaces()                            // Must not contain spaces
.is().not().oneOf(['Passw0rd', 'Password123','Azerty123', '123456789', '123123123']);  // Password blacklist (passwords to avoid)

module.exports = passwordSchema;

