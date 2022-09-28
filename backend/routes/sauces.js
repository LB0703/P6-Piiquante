// Importing express
const express = require("express");
// Importing the express Router function
const router = express.Router();

// Importing the authentication middleware
const auth = require("../middlewares/auth");
// Importing the multer configuration
const multer = require("../middlewares/multer-config");
// Importing the sauce controller
const sauceCtrl = require("../controllers/sauces");

// Creating all routes using authentication, multer and connecting routes to the request functions located in the sauce controller
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.ratingSauce);

// Exporting router
module.exports = router;
