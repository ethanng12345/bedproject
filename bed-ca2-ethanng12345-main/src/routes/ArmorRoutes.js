const express = require('express');
const router = express.Router();
const controller = require('../controllers/ArmorController');

router.put('/:boxer_id', controller.checkerboxer,controller.checkerarmor,controller.updateCoinsAndArmor,controller.createNew);
router.get('/', controller.readAll);
router.put('/updateprofile/:boxer_id', controller.checkerboxer,controller.checkerarmor,controller.checkownership,controller.updatearmor);
router.get('/:boxer_id/', controller.checkerboxer,controller.armorinventorybyid);
module.exports = router;