const mysql = require('mysql2/promise');
const moment = require('moment');
const formatDateTime = "YYYY-MM-DD HH:mm:ss";

class GoogleUserAdapterAdapter {
   constructor(config) {
      this.config = config;
      this.pool = mysql.createPool(this.config);
   }

   /**
    * Get articles by id
    * @param {*} id 
    * @param {*} limit 
    */
   async GetUserById(id, limit = 1) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("SELECT * FROM google_users WHERE id = ? LIMIT ?", [id, limit]);
      await conn.release();
      return rows;
   }

   /**
   * Add article row
   * @param {*} data 
   */
   async AddUser(data) {

      const uD = {
         id: data.id,
         token: data.token,
         email: data.email,
         name: data.name,
         photo: data.photo
      }

      console.log(uD)
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("INSERT INTO google_users(id, token, email, name, photo) VALUES(?,?,?,?,?)", [uD.id, uD.token, uD.email, uD.name, uD.photo]);
      await conn.release();
      return rows;
   }
}

module.exports = GoogleUserAdapterAdapter;