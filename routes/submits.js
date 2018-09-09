var express = require('express');
var router = express.Router();
const isLoggedIn = require('../libs/isLoggedIn');
require('dotenv').config();
const SubmitsAdapter = require('../connectors/SubmitsAdapter');

const submitsAdapter = new SubmitsAdapter({
   "host": process.env.MYSQL_HOST,
   "port": process.env.MYSQL_PORT,
   "database": process.env.MYSQL_DATABASE,
   "user": process.env.MYSQL_USER,
   "password": process.env.MYSQL_PASSWORD,
   "multipleStatements": true,
   // "timezone": "+00:00",
   // "dateStrings": true
});

/* GET ALL Submits */
router.get('/', async (req, res, next) => {
   try {
      const result = await submitsAdapter.GetSubmits();
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
         const result = await submitsAdapter.GetSubmitById(id);
         res.json(result);
      } catch (err) {
         next(err);
      }
   }
});

/* NEW ARTICLE */
router.post('/',  async (req, res, next) => {

   const submit = {
      _id: req.body._id,
      username: req.body.username,
      blockchain_author: req.body.blockchain_author,
      block_num: req.body.block_num,
      ref_block_num: req.body.ref_block_num,
      ref_block_prefix: req.body.ref_block_prefix,
      expiration: req.body.expiration,
      operations: req.body.operations,
      target: req.body.target,
      state: req.body.state,
      permlink: req.body.permlink,
      award: req.body.award
   }

   console.log("Submit")
   console.log(submit)
   try {
      const result = await submitsAdapter.AddSubmit(submit);
      console.log(result)
      if(result.affectedRows === 1){
         res.json({ message: "Submit created", id: result.insertId })
      } else {
         res.json({ message: "Submit create"})
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
         state: req.body.state,
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
