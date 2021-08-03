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
      res.set("Content-Type", "text/plain");
      res.status(200).json("Server is working...");
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  getMetaData(req, res) {
    try {
      getMetadata((tables) => {
        res.set("Content-Type", "application/json");
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
        res.set("Content-Type", "application/json");
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
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  getById(req, res) {
    try {
      const { table, id } = req.params;
      const include = req.query.include;
      if (!include) {
        getById(table, id, (originalData) => {
          res.set("Content-Type", "application/json");
          res.send(JSON.stringify(originalData));
        });
      } else {
        getById(table, id, (originalData) => {
          getById(include, originalData[include + "_id"], (extraData) => {
            const result = { ...originalData, [include]: extraData };
            res.set("Content-Type", "application/json");
            res.send(JSON.stringify(result));
          });
        });
      }
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  create(req, res) {
    try {
      const { table } = req.params;
      const obj = req.body;
      create(table, obj, (id) => {
        res.set("Content-Type", "text/plain");
        res.send(JSON.stringify(id));
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
        res.set("Content-Type", "text/plain");
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
        res.set("Content-Type", "text/plain");
        res.send(JSON.stringify(msg));
      });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

const restController = new Controller();

module.exports = restController;
