const express = require('express');
const router = express.Router();
const controller = require('../controllers/BoxerProfileController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
router.post('/',jwtMiddleware.verifyToken,controller.calculatelevel,controller.checkuserid,controller.deductSkillPointsMiddleware,controller.createNewProfile);
router.get('/leaderboard', controller.leaderboard);
router.put('/:boxer_id',jwtMiddleware.verifyToken,controller.readboxer,controller.readuser,controller.checkids,controller.calculatelevel,controller.deductSkillPointsMiddleware,controller.updatelevel);
router.delete('/:boxer_id', controller.deleteboxerbyID);
router.get('/', jwtMiddleware.verifyToken,controller.getboxerinfo);
router.get('/all/:boxer_id', controller.readall);

module.exports = router; 