const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { auth } = require('../middleware/auth');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleController');

router.use(bodyParser.json());
router.get('/articles', auth, getArticles);
router.post('/articles', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(90),
    description: Joi.string().required().min(2),
    publishedAt: Joi.string().required(),
    source: Joi.string().required().min(2),
    url: Joi.string().required().uri(),
    urlToImage: Joi.string().required().uri(),
  }),
}), createArticle);
router.delete('/articles/:articleId', auth, celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
}), deleteArticle);
module.exports = router;
