const Article = require('../models/article');
const { NotFoundError, InvalidError } = require('../middleware/errorHandling');

/* returns all articles saved by the user
GET /articles

# creates an article with the passed
# keyword, title, text, date, source, link, and image in the body
POST /articles

# deletes the stored article by _id
DELETE /articles/articleId */

function getArticles(req, res, next) {
  Article.find({})
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}
//  owner: req.user._id put inside article create maybe?
function createArticle(req, res, next) {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') { throw new InvalidError('Invalid data'); }
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  console.log(req.params);
  Article.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Article not found');
      } else {
        return res.status(200).send({ message: 'Article deleted' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new InvalidError('Invalid Article'); }
      if (err.name === 'NotFound') { throw new NotFoundError('Article not found'); }
    })
    .catch(next);
}
module.exports = { getArticles, createArticle, deleteArticle };
