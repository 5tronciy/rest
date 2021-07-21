require("dotenv").config();
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "university",
});

connection.connect();

connection.query("SHOW TABLES;", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();
