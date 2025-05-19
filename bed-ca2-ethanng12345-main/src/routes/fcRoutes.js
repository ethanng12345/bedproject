
const express = require('express');
const router = express.Router();
const controller = require('../controllers/fcController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', controller.readAllfc);
router.post('/', jwtMiddleware.verifyToken,controller.createNewC);




router.put('/:challenge_id',controller.getcreatorid,controller.updatefcById);
router.delete('/:challenge_id', controller.deletefcbyID);
module.exports = router;