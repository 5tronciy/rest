const {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getAllFilteredById,
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
    getMetadata()
      .then((tables) => {
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(tables));
      })
      .catch((e) => res.status(500).json(e.message));
  }

  getTableMetadata(req, res) {
    const { table } = req.params;
    getTableMetadata(table)
      .then((metadata) => {
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(metadata));
      })
      .catch((e) => res.status(500).json(e.message));
  }

  getAll(req, res) {
    const { table } = req.params;
    getAll(table)
      .then((data) => {
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      })
      .catch((e) => res.status(500).json(e.message));
  }

  getById(req, res) {
    const { table, id } = req.params;
    const include = req.query.include;
    include
      ? getById(table, id)
          .then((originalData) => {
            originalData[include + "_id"]
              ? getById(include, originalData[include + "_id"])
                  .then((extraData) => {
                    const result = { ...originalData, [include]: extraData };
                    res.set("Content-Type", "application/json");
                    res.send(JSON.stringify(result));
                  })
                  .catch((e) => res.status(500).json(e))
              : getAllFilteredById(table, include, originalData.id)
                  .then((extraData) => {
                    const result = { ...originalData, [include]: extraData };
                    res.set("Content-Type", "application/json");
                    res.send(JSON.stringify(result));
                  })
                  .catch((e) => res.status(500).json(e));
          })
          .catch((e) => res.status(500).json(e.message))
      : getById(table, id)
          .then((originalData) => {
            res.set("Content-Type", "application/json");
            res.send(JSON.stringify(originalData));
          })
          .catch((e) => res.status(500).json(e.message));
  }

  create(req, res) {
    const { table } = req.params;
    const obj = req.body;
    create(table, obj)
      .then((id) => {
        res.set("Content-Type", "text/plain");
        res.send(JSON.stringify(id));
      })
      .catch((e) => res.status(500).json(e.message));
  }

  updateById(req, res) {
    const { table, id } = req.params;
    const obj = req.body;
    updateById(table, id, obj)
      .then((msg) => {
        res.set("Content-Type", "text/plain");
        res.send(JSON.stringify(msg));
      })
      .catch((e) => res.status(500).json(e.message));
  }

  deleteById(req, res) {
    const { table, id } = req.params;
    deleteById(table, id)
      .then((msg) => {
        res.set("Content-Type", "text/plain");
        res.send(JSON.stringify(msg));
      })
      .catch((e) => res.status(500).json(e.message));
  }
}

const restController = new Controller();

module.exports = restController;
