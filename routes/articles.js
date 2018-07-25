var express = require('express');
var router = express.Router();
require('dotenv').config();
const ArticlesAdapter = require('../connectors/ArticlesAdapter');

const articlesAdapter = new ArticlesAdapter({
   "host": process.env.MYSQL_HOST,
   "port": process.env.MYSQL_PORT,
   "database": process.env.MYSQL_DATABASE,
   "user": process.env.MYSQL_USER,
   "password": process.env.MYSQL_PASSWORD,
   "multipleStatements": true,
   // "timezone": "+00:00",
   // "dateStrings": true
});

/* GET ALL ARTICLES */
router.get('/', async (req, res, next) => {
   const result = await articlesAdapter.GetArticles();
   res.json(result);
});

/* GET SINGLE ARTICLE BY ID */
router.get('/:id', async (req, res, next) => {
   const id = req.params.id
   if (isNaN(id)) {
      res.json({ message: "error id" });
   } else {
      const result = await articlesAdapter.GetArticleById(id);
      res.json(result);
   }
});

/* NEW ARTICLE */
router.post('/', async (req, res, next) => {
   const article = {
      title: req.body.title,
      username: req.body.username,
      tags: req.body.tags,
      data: req.body.data,
      state: req.body.state,
   }
   const result = await articlesAdapter.AddArticle(article);
   res.json(result);
});

/* UPDATE ARTICLE */
router.put('/:id', async (req, res, next) => {

   const id = req.params.id
   if (isNaN(id)) {
      res.json({ message: "error id" });
   } else {
      const article = {
         id: id,
         title: req.body.title,
         tags: req.body.tags,
         data: req.body.data,
         state: req.body.state,
      }
      const result = await articlesAdapter.UpdateArticle(article);
      res.json(result)
   }
});

/* DELETE ARTICLE */
router.delete('/:id', async (req, res, next) => {
   const id = req.params.id;
   if (isNaN(id)) {
      res.json({ message: "error id" });
   } else {
      const result = await articlesAdapter.DeleteById(id);
      res.json(result);
   }
});

module.exports = router;
