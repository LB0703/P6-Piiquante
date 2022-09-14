const express = require('express');
const router = express.Router();

const sauces = require('../models/sauces');

const saucesCtrl = require('../controllers/sauces');


router.get('/', saucesCtrl.getAllSauces);
router.post('/', saucesCtrl.createSauces);
router.get('/:id', saucesCtrl.getOneSauces);
router.put('/:id', saucesCtrl.modifySauces);
router.delete('/:id', saucesCtrl.deleteSauces);

module.exports = router;