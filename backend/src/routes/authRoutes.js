const express = require('express');
const router = express.Router();
const { signup, signin, profile } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authenticateToken, profile);

module.exports = router;