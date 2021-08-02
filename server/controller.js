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

  getMetaData(req, res) {
    try {
      getMetadata((tables) => {
        res.send(JSON.stringify(tables));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  getTableMetadata(req, res) {
    try {
      const { table } = req.params;
      getTableMetadata(table, (metadata) => {
        res.send(JSON.stringify(metadata));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  getAll(req, res) {
    try {
      const { table } = req.params;
      getAll(table, (data) => {
        res.send(JSON.stringify(data));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  getById(req, res) {
    try {
      const { table, id } = req.params;
      getById(table, id, req.query.include, (row) => {
        res.send(JSON.stringify(row));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  create(req, res) {
    try {
      const { table } = req.params;
      const obj = req.body;
      create(table, obj, (msg) => {
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  updateById(req, res) {
    try {
      const { table, id } = req.params;
      const obj = req.body;
      updateById(table, id, obj, (msg) => {
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  deleteById(req, res) {
    try {
      const { table, id } = req.params;
      deleteById(table, id, (msg) => {
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

const restController = new Controller();

module.exports = restController;
