require("dotenv").config();
const mysql = require("mysql");
const config = require("../config");
const { convertToJSType } = require("./utils");
const connection = mysql.createConnection(config.db);

const showTables = (callback) => {
  const result = [];
  connection.connect((error) => {
    if (error) throw error;
    connection.query("SHOW TABLES;", (error, results) => {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
        result.push(Object.values(results[i])[0]);
      }
      connection.end();
      callback(result);
    });
  });
};

const tableMeta = (tableName, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    connection.query("DESCRIBE " + tableName, (error, results, fields) => {
      if (error) throw error;
      const result = {};
      for (let i = 0; i < results.length; i++) {
        const field = results[i].Field;
        result[field] = convertToJSType(results[i].Type);
      }
      connection.end();
      callback(result);
    });
  });
};

const rowById = (tableName, id, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    connection.query(
      "SELECT * FROM " + tableName + " WHERE id=?",
      [id],
      (error, results, fields) => {
        if (error) throw error;
        const row = {};
        for (let key in results[0]) {
          row[key] = results[0][key];
        }
        connection.end();
        callback(row);
      }
    );
  });
};

const addRow = (tableName, data, callback) => {
  connection.connect((error) => {
    if (error) throw error;

    const template = [];
    const dataKeys = [];
    const dataValues = [];
    for (let key in data) {
      template.push("?");
      dataKeys.push(key);
      dataValues.push(data[key]);
    }
    const queryTemplate = template.join(", ");
    const tableNames = dataKeys.join(", ");

    const sql =
      "INSERT INTO " +
      tableName +
      " (" +
      tableNames +
      ") VALUES (" +
      queryTemplate +
      ")";
    connection.query(sql, dataValues, (error, results, fields) => {
      if (error) throw error;
      connection.end();
      callback(results.insertId);
    });
  });
};

module.exports = { showTables, tableMeta, rowById, addRow };
