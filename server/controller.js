const {
  getMetadata,
  getTableMetadata,
  getAll,
  getById,
  getReferencedTableAndColumn,
  create,
  updateById,
  deleteById,
  getAllFilteredById,
} = require("../services/db");

const compare = (a, b) =>
  a.length > b.length ? 1 : a.length == b.length ? 0 : -1;

const addExtraData = (object, include, table) => {
  if (include && include[0]) {
    const chain = include[0].split(".");
    const addExtra = () => {
      return getReferencedTableAndColumn(table, chain[0]).then((data) => {
        if (object[chain[0] + "_id"]) {
          return getById(data[0], object[chain[0] + "_id"]);
        } else {
          return getAllFilteredById(table, chain[0], object.id);
        }
      });
    };

    const nextNest = (extraData) => {
      const nesting = [chain.slice(1).join(".")];
      if (extraData.length) {
        return Promise.all(
          extraData.map((data) => addExtraData(data, nesting, chain[0]))
        );
      } else {
        return addExtraData(extraData, nesting, chain[0]);
      }
    };

    return addExtra()
      .then((extraData) => nextNest(extraData))
      .then((extraData) => {
        return { ...object, [chain[0]]: extraData };
      })
      .then((object) => {
        return include[1]
          ? addExtraData(object, include.splice(1), table)
          : object;
      });
  } else {
    return Promise.resolve(object);
  }
};

const addExtraDataToArray = (array, include, table) => {
  if (include && include[0]) {
    const addExtra = () => {
      return Promise.all(
        array.map((data) => addExtraData(data, include, table))
      );
    };

    return addExtra().then((object) => {
      return include[1]
        ? addExtraData(object, include.splice(1), table)
        : object;
    });
  } else {
    return Promise.resolve(array);
  }
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
    const include =
      typeof req.query.include === "string"
        ? [req.query.include]
        : req.query.include;
    getAll(table)
      .then((data) => addExtraDataToArray(data, include, table))
      .then((data) => {
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(data));
      })
      .catch((e) => res.status(500).json(e.message));
  }

  getById(req, res) {
    const { table, id } = req.params;
    const include =
      typeof req.query.include === "string"
        ? [req.query.include]
        : req.query.include;
    const filteredInclude = include
      .filter((item) => {
        let count = 0;
        for (let str of include) {
          if (str.indexOf(item) === 0) {
            count += 1;
          }
        }
        if (count === 1) {
          return item;
        }
      })
      .sort(compare);
    getById(table, id)
      .then((data) => addExtraData(data, filteredInclude, table))
      .then((data) => {
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(data));
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
