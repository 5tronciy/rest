require("dotenv").config();
const mysql = require("mysql");
const config = require("../config");
const connection = mysql.createConnection(config.db);

const showTables = (callback) => {
  const result = [];
  connection.connect((error) => {
    if (error) throw error;
    connection.query("SHOW TABLES;", (error, results) => {
      connection.end();
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
        result.push(results[i]["Tables_in_" + process.env.DATABASE]);
      }
      callback(result);
    });
  });
};

const tableMeta = (tableName, callback) => {
  connection.connect();
  connection.query("DESCRIBE " + tableName, (error, results) => {
    if (error) throw error;
    const result = [];
    for (let i = 0; i < results.length; i++) {
      result.push(results[i].Field + ": " + results[i].Type);
    }
    callback(result);
  });
  connection.end();
};

const rowById = (tableName, id, callback) => {
  connection.connect();
  connection.query(
    "SELECT * FROM " + tableName + " WHERE id=?",
    [id],
    (error, results) => {
      if (error) throw error;
      const result = { ...results[0] };
      callback(result);
    }
  );
  connection.end();
};

module.exports = { showTables, tableMeta, rowById };
