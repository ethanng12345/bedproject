const express = require('express');
const router = express.Router();
const controller = require('../controllers/MatchesController');


router.post('/',controller.checkerboxer,controller.getEquipmentMultipliers,controller.updateCoins,controller.updateProfile,controller.results);
router.get("/:boxer_id", controller.readboxer,controller.getMatchesByBoxerID);
module.exports = router;