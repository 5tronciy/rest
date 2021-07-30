const {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../services/db");

class Controller {
  start(req, res) {
    try {
      res.status(200).json("Server is working...");
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getMetaData(req, res) {
    try {
      await getMetadata((tables) => {
        res.send(JSON.stringify(tables));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getTableMetadata(req, res) {
    try {
      const { table } = req.params;
      await getTableMetadata(table, (metadata) => {
        res.send(JSON.stringify(metadata));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getAll(req, res) {
    try {
      const { table } = req.params;
      await getAll(table, (data) => {
        res.send(JSON.stringify(data));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getById(req, res) {
    try {
      const { table, id } = req.params;
      await getById(table, id, (row) => {
        res.send(JSON.stringify(row));
      });
    } catch (e) {
      res.status(500).json(e.message);
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
      res.status(500).json(e.message);
    }
  }

  async updateById(req, res) {
    try {
      const { table, id } = req.params;
      const obj = req.body;
      await updateById(table, id, obj, (msg) => {
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async deleteById(req, res) {
    try {
      const { table, id } = req.params;
      await deleteById(table, id, (msg) => {
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

const restController = new Controller();

module.exports = restController;
