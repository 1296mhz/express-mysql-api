const mysql = require('mysql2/promise');
const moment = require('moment');
const formatDateTime = "YYYY-MM-DD HH:mm:ss";
require('dotenv').config();

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

      const conn = await this.pool.getConnection();
      let [rows, fields] = await conn.query("INSERT INTO submits(_id, username, blockchain_author, block_num, ref_block_num, ref_block_prefix, expiration, operations, target, state, permlink, award, created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
         [uD._id, uD.username, uD.blockchain_author, uD.block_num, uD.ref_block_num, uD.ref_block_prefix, uD.expiration, uD.operations, uD.target, uD.state, uD.permlink, uD.award, uD.created_at]);
      console.log(rows)
      await conn.release();
      return rows;
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



async function main() {

   const testData = {
      _id: 'cf3276c0cac72e3503be0af95b61028b86e553a5',
      username: 'Превозмогая Трудности',
      blockchain_author: 'cashburn',
      block_num: 24828656,
      ref_block_num: 56030,
      ref_block_prefix: 3023130275,
      expiration: '2018-08-06 11:32:18',
      operations: 'comment',
      target: 'steem',
      state: 'submit_process',
      permlink: 're-groismanadvisedukrainianstoconsumelessgas-20180806t112220734z',
      award: '0',
   }

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

   try{
      const result = await submitsAdapter.AddSubmit(testData);
      console.log(result)
      process.exit();
   }catch(err){
      console.log(err)
      process.exit();
   }



}

main()