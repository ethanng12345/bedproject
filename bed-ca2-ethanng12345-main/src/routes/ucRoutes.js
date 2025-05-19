const express = require('express');
const router = express.Router();
const controller = require('../controllers/ucController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
router.post('/:challenge_id', jwtMiddleware.verifyToken,controller.fetchskillpoints,controller.updateskillpoints, controller.createNewCr);
router.get('/:challenge_id', controller.readALLcr);
module.exports = router; 