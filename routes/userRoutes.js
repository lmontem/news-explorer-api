const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { getUserInfo } = require('../controllers/userController');

router.use(bodyParser.json());
router.get('/users/me', getUserInfo);

module.exports = router;
