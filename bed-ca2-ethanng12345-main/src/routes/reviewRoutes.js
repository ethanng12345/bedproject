const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/',controller.readAllReview);
router.post('/', jwtMiddleware.verifyToken,controller.checkchallenge,controller.checkreviews,controller.createReview);
router.get('/verify/:userid',jwtMiddleware.verifyToken,controller.readUserReviews);
router.get('/:challenge_id',controller.readReviewById);
router.put('/', jwtMiddleware.verifyToken,controller.checkchallenge,controller.checkreviews,controller.updateReviewById);
router.delete('/', jwtMiddleware.verifyToken,controller.checkchallenge,controller.checkreviews,controller.deleteReviewById);


module.exports = router;



