const express = require("express");
const app = express();
const port = 10000;

const {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  create,
} = require("../services/db");

app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.status(200).json("Server is working...");
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/rest/metadata", (req, res) => {
  try {
    getMetadata((tables) => {
      res.send(JSON.stringify(tables));
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/rest/:table/metadata", (req, res) => {
  try {
    const { table } = req.params;
    getTableMetadata(table, (metadata) => {
      res.send(JSON.stringify(metadata));
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/rest/:table", (req, res) => {
  try {
    const { table } = req.params;
    getAll(table, (data) => {
      res.send(JSON.stringify(data));
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/rest/:table/:id", (req, res) => {
  try {
    const { table, id } = req.params;
    getById(table, id, (row) => {
      res.send(JSON.stringify(row));
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/rest/:table", async (req, res) => {
  try {
    const { table } = req.params;
    const obj = req.body;
    await create(table, obj, (msg) => {
      res.send(JSON.stringify(msg));
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
