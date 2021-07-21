const express = require("express");
const app = express();
const port = 10000;

const { showTables } = require("./services/db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/app/rest/metadata", (req, res) => {
  const tables = showTables();
  res.send(tables);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
