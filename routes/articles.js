var express = require('express');
var router = express.Router();
const isLoggedIn = require('../libs/isLoggedIn');
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
   try {
      const result = await articlesAdapter.GetArticles();
      res.json(result);
   } catch (err) {
      next(err)
   }
});

/* GET SINGLE ARTICLE BY ID */
router.get('/:id',  async (req, res, next) => {
   const id = req.params.id
   if (isNaN(id)) {
      res.json({ message: "error id" });
   } else {
      try {
         const result = await articlesAdapter.GetArticleById(id);
         res.json(result);
      } catch (err) {
         next(err);
      }
   }
});

/* NEW ARTICLE */
router.post('/',  async (req, res, next) => {
   const article = {
      title: req.body.title,
      username: req.body.username,
      tags: req.body.tags,
      publish_network: req.body.publish_network,
      data: req.body.data,
      state: "created",
   }
   try {
      const result = await articlesAdapter.AddArticle(article);
      console.log(result)
      if(result.affectedRows === 1){
         res.json({ message: "Article created", id: result.insertId })
      } else {
         res.json({ message: "Article create"})
      }
   } catch (err) {
      next(err);
   }
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
         publish_network: req.body.publish_network,
         state: "created",
      }
      try {
         const result = await articlesAdapter.UpdateArticle(article);
         if(result.affectedRows === 1){
            res.json({ message: "Article updated " + id})
         }else {
            res.json({ message: "Article update error"})
         }
         
      } catch (err) {
         next(err);
      }

   }
});

/* DELETE ARTICLE */
router.delete('/:id', async (req, res, next) => {
   const id = req.params.id;
   if (isNaN(id)) {
      res.json({ message: "error id" });
   } else {
      try {
         const result = await articlesAdapter.DeleteById(id);
         if(result.affectedRows === 1){
            res.json({ message: "Article deleted: " + id });
         } else {
            res.json({ mesage: "Delete error"});
         }
       
      } catch (err) {
         next(err);
      }
   }
});

module.exports = router;
