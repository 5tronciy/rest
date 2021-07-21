require("dotenv").config();
const mysql = require("mysql");
const config = require("../config");
const connection = mysql.createConnection(config.db);

const showTables = () => {
  connection.connect();
  connection.query("SHOW TABLES;", function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
  connection.end();
};

const tableMeta = (tableName) => {
  connection.connect();
  connection.query("DESCRIBE " + tableName, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
  connection.end();
};

const rowById = (tableName, id) => {
  connection.connect();
  connection.query(
    "SELECT * FROM " + tableName + " WHERE id=?",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    }
  );
  connection.end();
};

module.exports = { showTables, tableMeta, rowById };
