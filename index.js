require("dotenv").config();
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "university",
});

const showTables = () => {
  connection.query("SHOW TABLES;", function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
};

const tableMeta = (tableName) => {
  connection.query("DESCRIBE " + tableName, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
};

const rowById = (tableName, id) => {
  connection.query(
    "SELECT * FROM " + tableName + " WHERE id=?",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    }
  );
};

connection.connect();

showTables();

// tableMeta("instructor");

// rowById("instructor", 76766);

connection.end();
