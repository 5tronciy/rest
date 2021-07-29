const {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  create,
} = require("../services/db");

class Controller {
  start(req, res) {
    try {
      res.status(200).json("Server is working...");
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getMetaData(req, res) {
    try {
      await getMetadata((tables) => {
        res.send(JSON.stringify(tables));
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getTableMetadata(req, res) {
    try {
      const { table } = req.params;
      console.log(table);
      await getTableMetadata(table, (metadata) => {
        res.send(JSON.stringify(metadata));
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    try {
      const { table } = req.params;
      await getAll(table, (data) => {
        res.send(JSON.stringify(data));
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getById(req, res) {
    try {
      const { table, id } = req.params;
      await getById(table, id, (row) => {
        res.send(JSON.stringify(row));
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async create(req, res) {
    try {
      const { table } = req.params;
      const obj = req.body;
      await create(table, obj, (msg) => {
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

const restController = new Controller();

module.exports = restController;
