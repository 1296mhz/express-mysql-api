const mysql = require('mysql2/promise');
const moment = require('moment');
const formatDateTime = "YYYY-MM-DD HH:mm:ss";

class SubmitsAdapter {
   constructor(config) {
      this.config = config;
      this.pool = mysql.createPool(this.config);
   }

   /**
    * Get all articles
    * @param {*} id
    * @param {*} limit
    */
   async GetSubmits(id, limit = 100) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("SELECT * FROM submits LIMIT ?", [limit]);
      await conn.release();
      return rows;
   }

   /**
    * Get articles by id
    * @param {*} id
    * @param {*} limit
    */
   async GetSubmitById(id, limit = 1) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("SELECT * FROM submits WHERE id = ? LIMIT ?", [id, limit]);
      await conn.release();
      return rows;
   }

   /**
   * Add article row
   * @param {*} data
   */
   async AddSubmit(data) {
      const datetime = new Date();
      const expiration = moment(data.expiration).format(formatDateTime);

      const uD = {
         _id: data._id,
         username: data.username,
         blockchain_author: data.blockchain_author,
         block_num: data.block_num,
         ref_block_num: data.ref_block_num,
         ref_block_prefix: data.ref_block_prefix,
         expiration: expiration,
         operations: data.operations,
         target: data.target,
         state: data.state,
         permlink: data.permlink,
         award: data.award,
         created_at: moment(datetime).format(formatDateTime)
      };

      console.log("UD: ");
      console.log(uD);
      const conn = await this.pool.getConnection();
      try{
        let [rows, fields] = await conn.query("INSERT INTO submits(_id, username, blockchain_author, block_num, ref_block_num, ref_block_prefix, expiration, operations, target, state, permlink, award, created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", 
        [uD._id, 
           uD.username, 
           uD.blockchain_author, 
           uD.block_num, 
           uD.ref_block_num, 
           uD.ref_block_prefix, 
           uD.expiration, 
           uD.operations,
           uD.target, 
           uD.state, 
            uD.permlink, 
            uD.award, 
            uD.created_at]);
     console.log(rows)
     await conn.release();
     return rows;
      }catch(err){
            console.log("Err submit ", err)
      }

   }

   /**
   * Update article by id
   * @param {*} data
   */
   async UpdateSubmit(data) {

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
      let [rows, fields] = await conn.query("UPDATE submit SET title=?, tags=?, data=?, state=?, updated_at=? WHERE id=?;", [uD.title, uD.tags, uD.data, uD.state, uD.updated_at, uD.id]);
      await conn.release();
      return rows;
   }

   /**
   * Delete row by id
   * @param {*} id
   */
   async DeleteById(id) {
      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("DELETE FROM submit WHERE id = ? LIMIT 1", [id]);
      await conn.release();
      return rows;
   }
}

module.exports = SubmitsAdapter;