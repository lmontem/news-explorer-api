const router = require('express').Router();
const bodyParser = require('body-parser');
const { auth } = require('../middleware/auth');

const { getUserInfo } = require('../controllers/userController');

router.use(bodyParser.json());
router.get('/users/me', auth, getUserInfo);

module.exports = router;
