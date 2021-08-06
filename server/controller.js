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

const addExtraData = (object, table, include) => {
  return new Promise((resolve, reject) => {
    const chain = include.split(".");
    Promise.resolve(
      object[chain[0] + "_id"]
        ? getById(chain[0], object[chain[0] + "_id"])
        : getAllFilteredById(table, chain[0], object.id)
    )
      .then((extraData) => {
        if (chain.length === 1) {
          resolve({ ...object, [chain[0]]: extraData });
        } else {
          const nesting = chain.slice(1).join(".");
          const result = { ...object, [chain[0]]: extraData };
          if (extraData.length) {
            const results = [];
            for (let i = 0; i < extraData.length; i++) {
              results.push(
                addExtraData(extraData[i], chain[i], nesting).then((d) => {
                  result[chain[0]][i] = d;
                })
              );
            }
            Promise.all(results).then(() => {
              resolve(result);
            });
          } else {
            addExtraData(extraData, chain[0], nesting)
              .then((d) => {
                result[chain[0]] = d;
                return result;
              })
              .then((result) => {
                resolve(result);
              });
          }
        }
      })
      .catch((e) => reject(e));
  });
};

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
    if (include) {
      switch (typeof include) {
        case "string":
          getById(table, id)
            .then((originalData) => {
              addExtraData(originalData, table, include).then((data) => {
                res.set("Content-Type", "application/json");
                res.send(JSON.stringify(data));
              });
            })
            .catch((e) => res.status(500).json(e.message));
          break;
        case "object":
          getById(table, id)
            .then((originalData) => {
              const results = [];
              for (let i = 0; i < include.length; i++) {
                results.push(addExtraData(originalData, table, include[i]));
              }
              Promise.all(results).then((data) => {
                res.set("Content-Type", "application/json");
                res.send(JSON.stringify(data));
              });
            })
            .catch((e) => res.status(500).json(e.message));
          break;
        default:
          console.log("Unexpected type of include: " + typeof include);
      }
    } else {
      getById(table, id)
        .then((originalData) => {
          res.set("Content-Type", "application/json");
          res.send(JSON.stringify(originalData));
        })
        .catch((e) => res.status(500).json(e.message));
    }
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
