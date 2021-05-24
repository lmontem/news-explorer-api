const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleController');

router.use(bodyParser.json());
router.get('/articles', getArticles);
router.post('/articles', createArticle);
router.delete('/articles/:articleId', deleteArticle);
module.exports = router;
