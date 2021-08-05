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

const addExtraData = (originalData, table, include) => {
  return new Promise((resolve, reject) => {
    Promise.resolve(
      originalData[include + "_id"]
        ? getById(include, originalData[include + "_id"])
        : getAllFilteredById(table, include, originalData.id)
    )
      .then((extraData) => {
        resolve({ ...originalData, [include]: extraData });
      })
      .catch((e) => console.log(e));
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
          const chain = include[1].split(".");
          getById(table, id).then((originalData) => {
            getById(chain[0], originalData[chain[0] + "_id"]).then(
              (extraData) => {
                console.log(extraData);
                addExtraData(extraData, chain[0], chain[1]).then(
                  (extraData) => {
                    const result = { ...originalData, [include[0]]: extraData };
                    res.set("Content-Type", "application/json");
                    res.send(JSON.stringify(result));
                  }
                );
              }
            );
          });
          break;
        // } else{

        // }
        // }
        //   getById(table, id)
        //     .then((originalData) => {
        //       if (originalData[include[0] + "_id"]) {
        //         getById(include[0], originalData[include[0] + "_id"])
        //           .then((extraData) => {
        //             const result = { ...originalData, [include[0]]: extraData };
        //             res.set("Content-Type", "application/json");
        //             res.send(JSON.stringify(result));
        //           })
        //           .then(getAllFilteredById(table, include[0], originalData.id))
        //           // .then(
        //           //   getById(
        //           //     include[1],
        //           //     originalData[include[0] + "_id"][include[1] + "_id"]
        //           //   )
        //           // )
        //           .then((extraExtraData) => {
        //             const result = {
        //               ...originalData,
        //               ...extraData,
        //               [include[1]]: extraExtraData,
        //             };
        //             res.set("Content-Type", "application/json");
        //             res.send(JSON.stringify(result));
        //           })
        //           .catch((e) => res.status(500).json(e));
        //       } else {
        //         getAllFilteredById(table, include[0], originalData.id)
        //           .then((extraData) => {
        //             const result = { ...originalData, [include[0]]: extraData };
        //             res.set("Content-Type", "application/json");
        //             res.send(JSON.stringify(result));
        //           })
        //           .catch((e) => res.status(500).json(e));
        //       }
        //     })
        //     .catch((e) => res.status(500).json(e.message));
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
