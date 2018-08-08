const mysql = require('mysql2/promise');
const moment = require('moment');
const formatDateTime = "YYYY-MM-DD HH:mm:ss";

class ArticlesAdapter {
   constructor(config) {
      this.config = config;
      this.pool = mysql.createPool(this.config);
   }

   /**
    * Get all articles
    * @param {*} id
    * @param {*} limit
    */
   async GetArticles(id, limit = 100) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("SELECT * FROM articles LIMIT ?", [limit]);
      await conn.release();
      return rows;
   }

   /**
    * Get articles by id
    * @param {*} id
    * @param {*} limit
    */
   async GetArticleById(id, limit = 1) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("SELECT * FROM articles WHERE id = ? LIMIT ?", [id, limit]);
      await conn.release();
      return rows;
   }

   /**
   * Add article row
   * @param {*} data
   */
   async AddArticle(data) {
      const datetime = new Date();

      console.log("ADD " + moment(datetime).format(formatDateTime))
      console.log("ADD UTC", moment.utc(datetime).format(formatDateTime))
      let datetimeSave =  moment(datetime).format(formatDateTime)
      const uD = {
         title: data.title,
         username: data.username,
         tags: data.tags,
         data: data.data,
         state: data.state,
         created_at: datetimeSave
      }
      console.log("AddArticle")
      console.log(uD)
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("INSERT INTO articles(title, username, tags, data, state, created_at) VALUES(?,?,?,?,?,?)", [uD.title, uD.username, uD.tags, uD.data, uD.state, uD.created_at]);
      console.log(rows)
      await conn.release();
      return rows;
   }

   /**
   * Update article by id
   * @param {*} data
   */
   async UpdateArticle(data) {

      const datetime = new Date();

      const uD = {
         id: data.id,
         title: data.title,
         tags: data.tags,
         data: data.data,
         state: data.state,
         updated_at: moment.utc(datetime).format(formatDateTime)
      }

      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("UPDATE articles SET title=?, tags=?, data=?, state=?, updated_at=? WHERE id=?;", [uD.title, uD.tags, uD.data, uD.state, uD.updated_at, uD.id]);
      await conn.release();
      return rows;
   }

   /**
   * Delete row by id
   * @param {*} id
   */
   async DeleteById(id) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("DELETE FROM articles WHERE id = ? LIMIT 1", [id]);
      await conn.release();
      return rows;
   }
}

module.exports = ArticlesAdapter;