const mysql = require('mysql2/promise');
const moment = require('moment');
const formatDateTime = "YYYY-MM-DD HH:mm:ss";
class ArticlesAdapter {
   constructor(config) {
      this.config = config;
      this.pool = mysql.createPool(this.config);

   //   this.CreateTable();
   }

   /**
    * Create tables
    */
   /*
   async CreateTable() {
      const conn = await this.pool.getConnection();
      const data = fs.readFileSync(path.resolve(__dirname, '../sql/migrations.sql'), { encoding: "UTF-8"});
      const [rows, fields] = await conn.query(data, []);
      await conn.release();
   }
*/
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
   * Put row
   * @param {*} user
   * @param {*} token 
   */
   async AddArticle(data) {
      const datetime = new Date();

      const uD = {
         title: data.title,
         username: data.username,
         tags: data.tags,
         data: data.data,
         state: data.state,
         created_at: moment.utc(datetime).format(formatDateTime)
      }

      console.log(uD)
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("INSERT INTO articles(title, username, tags, data, state, created_at) VALUES(?,?,?,?,?,?)", [uD.title, uD.username, uD.tags, uD.data, uD.state, uD.created_at]);
      await conn.release();
      return rows;
   }
   
   /**
   * Delete row by token
   * @param {*} user
   * @param {*} token 
   */
   async DeleteByToken(id) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("DELETE FROM tokens WHERE token = ? LIMIT 1", [token]);
      await conn.release();
      return rows;
   }

   /**
    * Add portfolio to user
    * @param {*} user 
    * @param {*} portfolio 
    */
   async AddUserPortfolio(user, portfolio) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("UPDATE users SET portfolio=JSON_ARRAY_APPEND(portfolio, '$', ?) where id=?;", [portfolio, user]);
      await conn.release();
      return rows;
   }

   /**
    * Remove portfolio from user
    */
   async RemoveUserPortfolio(user, portfolio) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("UPDATE users SET portfolio=JSON_REMOVE(`portfolio`,JSON_UNQUOTE(JSON_SEARCH(`portfolio`, 'one', ?))) where id=?;", [portfolio, user]);
      await conn.release();
      return rows;
   }
}

module.exports = ArticlesAdapter;