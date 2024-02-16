const express = require('express');
const router = express.Router();
const { validateData, validateJWT } = require('../middlewares/authMiddleware');
const { signup, login, update, getUserInfos, addScoreToUser, getBestScore, getRanking } = require('../controller/userController');

router.post('/signup', validateData, signup);
router.post('/login', login);

router.put('/user/:id',validateJWT, update);
router.get('/user/:id', validateJWT, getUserInfos);

router.post('/addScore/:userId', addScoreToUser);
router.get('/bestScore/:id', getBestScore);
router.get('/ranking', getRanking);

module.exports = router;