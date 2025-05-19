const express = require('express');
const router = express.Router();
const controller = require('../controllers/WeaponsController');

router.put('/:boxer_id', controller.checkerboxer,controller.checkerweapon,controller.updateCoinsAndWeapon,controller.createNew);
router.put('/updateprofile/:boxer_id', controller.checkerboxer,controller.checkerweapon,controller.checkownership,controller.updateweapon);
router.get('/', controller.readAll);
router.get('/:boxer_id', controller.checkerboxer,controller.weaponinventorybyid);

module.exports = router;