const Article = require('../models/article');
const { NotFoundError, InvalidError, PermissionError } = require('../middleware/errorHandling');
const {
  articleNotFoundMessage,
  invalidDataMessage,
  permissionMessage,
  deleteMessage,
} = require('../constants/constants');

/* returns all articles saved by the user
GET /articles
*/
function getArticles(req, res, next) {
  Article.find({ owner: req.user._id })
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

/* creates an article
POST /articles */
function createArticle(req, res, next) {
  const {
    keyword, title, description, publishedAt, source, url, urlToImage,
  } = req.body;
  Article.create({
    keyword, title, description, publishedAt, source, url, urlToImage, owner: req.user._id,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new InvalidError(invalidDataMessage); }
    })
    .catch(next);
}

/* deletes the stored article by _id
DELETE /articles/articleId */
function deleteArticle(req, res, next) {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError(articleNotFoundMessage);
      }
      if (String(article.owner) !== req.user._id) {
        throw new PermissionError(permissionMessage);
      }
      return Article.deleteOne(article)
        .then(() => {
          res.status(200).send({ message: deleteMessage });
        });
    })
    .catch(next);
}
module.exports = { getArticles, createArticle, deleteArticle };
