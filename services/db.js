require("dotenv").config();
const mysql = require("mysql");
const config = require("../config");
const { convertToJSType } = require("./utils");

const getMetadata = () => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const result = [];
      const sql = "SHOW TABLES;";
      connection.query(sql, (error, results) => {
        if (error) reject(error);
        for (let i = 0; i < results.length; i++) {
          result.push(Object.values(results[i])[0]);
        }
        connection.end();
        resolve(result);
      });
    });
  });
};

const getTableMetadata = (table) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const sql = `DESCRIBE ${table};`;
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);
        const result = {};
        for (let i = 0; i < results.length; i++) {
          const field = results[i].Field;
          result[field] = convertToJSType(results[i].Type);
        }
        connection.end();
        resolve(result);
      });
    });
  });
};

const getAll = (table) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const sql = `SELECT * FROM ${table};`;
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);
        const rows = [];
        for (let row in results) {
          rows.push({ ...results[row] });
        }
        connection.end();
        resolve(rows);
      });
    });
  });
};

const getById = (table, id) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const sql = `SELECT * FROM ${table} WHERE id=?;`;
      connection.query(sql, [id], (error, results, fields) => {
        if (error) reject(error);
        const row = {};
        fields.map((field) => (row[field.name] = results[0][field.name]));
        connection.end();
        resolve(row);
      });
    });
  });
};

const getReferencedTableAndColumn = (table, column) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const sql = `SELECT
                    REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                  FROM
                    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                  WHERE
                    TABLE_NAME = '${table}' AND
                    COLUMN_NAME = '${column}_id';`;
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);
        connection.end();
        if (results[0]) {
          resolve([
            results[0].REFERENCED_TABLE_NAME,
            results[0].REFERENCED_COLUMN_NAME,
          ]);
        } else {
          const connection = mysql.createConnection(config.db);
          connection.connect((error) => {
            if (error) reject(error);
            const sql = `SELECT
                           REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                        FROM
                          INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                        WHERE
                          REFERENCED_TABLE_NAME = '${table}' AND
                          TABLE_NAME = '${column}';`;
            connection.query(sql, (error, results, fields) => {
              if (error) reject(error);
              connection.end();
              resolve([
                results[0].REFERENCED_TABLE_NAME,
                results[0].REFERENCED_COLUMN_NAME,
              ]);
            });
          });
        }
      });
    });
  });
};

const create = (table, obj) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
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
        if (error) reject(error);
        connection.end();
        resolve(results.insertId);
      });
    });
  });
};

const updateById = (table, id, obj) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      let changes = "";
      for (let key in obj) {
        changes += `${key} = '${obj[key]}', `;
      }
      const sql = `UPDATE ${table} SET ${changes.slice(
        0,
        changes.length - 2
      )} WHERE id=?;`;
      connection.query(sql, [id], (error, results, fields) => {
        if (error) reject(error);
        connection.end();
        resolve(results.message);
      });
    });
  });
};

const deleteById = (table, id) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const sql = `DELETE FROM ${table} WHERE id = ?;`;
      connection.query(sql, [id], (error, results) => {
        if (error) reject(error);
        connection.end();
        resolve(`deleted rows: ${results.affectedRows}`);
      });
    });
  });
};

const getAllFilteredById = (filterTable, table, filterId) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config.db);
    connection.connect((error) => {
      if (error) reject(error);
      const sql = `SELECT * FROM ${table} WHERE ${filterTable}_id = ?;`;
      connection.query(sql, [filterId], (error, results) => {
        if (error) reject(error);
        connection.end();
        const rows = [];
        for (let row in results) {
          rows.push({ ...results[row] });
        }
        resolve(rows);
      });
    });
  });
};

module.exports = {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  getReferencedTableAndColumn,
  create,
  updateById,
  deleteById,
  getAllFilteredById,
};
