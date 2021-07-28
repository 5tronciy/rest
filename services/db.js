require("dotenv").config();
const mysql = require("mysql");
const config = require("../config");
const { convertToJSType } = require("./utils");
const connection = mysql.createConnection(config.db);

const getMetadata = (callback) => {
  const result = [];
  connection.connect((error) => {
    if (error) throw error;
    const sql = "SHOW TABLES;";
    connection.query(sql, (error, results) => {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
        result.push(Object.values(results[i])[0]);
      }
      connection.end();
      callback(result);
    });
  });
};

const getTableMetadata = (table, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    const sql = `DESCRIBE ${table};`;
    connection.query(sql, (error, results, fields) => {
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

const getAll = (table, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    const sql = `SELECT * FROM ${table};`;
    connection.query(sql, (error, results, fields) => {
      if (error) throw error;
      const rows = [];
      for (let row in results) {
        rows.push({ ...results[row] });
      }
      connection.end();
      callback(rows);
    });
  });
};

const getById = (table, id, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    const sql = `SELECT * FROM ${table} WHERE id=?;`;
    connection.query(sql, [id], (error, results, fields) => {
      if (error) throw error;
      const row = {};
      fields.map((field) => (row[field.name] = results[0][field.name]));
      connection.end();
      callback(row);
    });
  });
};

const create = (table, obj, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    const template = [];
    const dataKeys = [];
    const dataValues = [];
    for (let key in obj) {
      template.push("?");
      dataKeys.push(key);
      dataValues.push(obj[key]);
    }
    const sql = `INSERT INTO ${table} (${dataKeys.join(
      ", "
    )}) VALUES (${template.join(", ")});`;
    connection.query(sql, dataValues, (error, results) => {
      if (error) throw error;
      connection.end();
      callback(results.insertId);
    });
  });
};

const updateById = (table, id, obj, callback) => {
  connection.connect((error) => {
    if (error) throw error;
    let changes = "";
    for (let key in obj) {
      changes += `${key} = '${obj[key]}', `;
    }
    const sql = `UPDATE ${table} SET ${changes.slice(
      0,
      changes.length - 2
    )} WHERE id=?;`;
    connection.query(sql, [id], (error, results, fields) => {
      if (error) throw error;
      connection.end();
      callback(results.message);
    });
  });
};

const deleteById = (table, id, callback) => {};

module.exports = {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
