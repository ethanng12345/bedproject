const express = require('express');
const router = express.Router();

// Import route files
const fcRoutes = require('./fcRoutes');
const userRoutes = require('./userRoutes');
const ucRoutes = require('./ucRoutes');
const BoxerProfileRoutes = require('./BoxerProfileRoutes');
const ArmorRoutes = require('./ArmorRoutes');
const WeaponsRoutes = require('./WeaponsRoutes');
const MatchesRoutes = require('./MatchesRoutes');
const reviewRoutes = require('./reviewRoutes');

// Use routes
router.use('/challenges', fcRoutes);
router.use('/users', userRoutes);
router.use('/usercompletion', ucRoutes);
router.use('/profile', BoxerProfileRoutes);
router.use('/armor', ArmorRoutes); // Changed to lowercase for consistency
router.use('/weapon', WeaponsRoutes); // Changed to lowercase for consistency
router.use('/matches', MatchesRoutes);
router.use('/review', reviewRoutes);

// Middleware
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');

// Controllers
const userController = require('../controllers/userController');

// Login route
router.post(
    '/login',
    userController.login, // Assumes this sets `req.user`
    bcryptMiddleware.comparePassword, // Depends on `req.user` being set
    jwtMiddleware.generateToken, // Assumes `req.user` is still available
    jwtMiddleware.sendToken,
    
);

// Register route
router.post(
    '/register',
    userController.checkUsernameOrEmailExist, // Checks if username/email already exists
    bcryptMiddleware.hashPassword, // Hashes the password
    userController.register, // Registers the user
    jwtMiddleware.generateToken, // Generates token
    jwtMiddleware.sendToken, // Sends the token to the client
   
);



router.post( 
    '/verify',
    jwtMiddleware.verifyToken,jwtMiddleware.showTokenVerified
    
);

module.exports = router;
