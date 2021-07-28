const express = require("express");
const app = express();
const port = 10000;

const {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
} = require("./services/db");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/rest/metadata", (req, res) => {
  getMetadata((tables) => {
    res.send(JSON.stringify(tables));
  });
});

app.get("/rest/:table/metadata", (req, res) => {
  const { table } = req.params;
  getTableMetadata(table, (metadata) => {
    res.send(JSON.stringify(metadata));
  });
});

app.get("/rest/:table", (req, res) => {
  const { table } = req.params;
  getAll(table, (data) => {
    res.send(JSON.stringify(data));
  });
});

app.get("/rest/:table/:id", (req, res) => {
  const { table, id } = req.params;
  getById(table, id, (row) => {
    res.send(JSON.stringify(row));
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
