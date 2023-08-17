// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "root",
// });

// module.exports = pool.promise();

const { Sequelize } = require("sequelize"); //Start with the capital letter in the name of Sequelize because it's a constructor function

const sequelize = new Sequelize("node-complete", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize; 
