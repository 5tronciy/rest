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
      getById(
        table,
        id,
        req.query.include,
        ({
          playerId: id,
          birth_date: birthDate,
          first_name: firstName,
          force_refresh: forceRefresh,
          last_name: lastName,
          middle_name: middleName,
          position,
          team: {
            id: id1,
            abbrev,
            active,
            common_name: commonName,
            force_refresh: forceRefresh1,
            full_name: fullName,
            general_manager: generalManager,
            location,
          },
          team_id,
        }) => {
          [forceRefresh, forceRefresh1, active] = [
            forceRefresh,
            forceRefresh1,
            active,
          ].map((item) => Boolean(item));
          res.set("Content-Type", "application/json");
          res.send(
            JSON.stringify({
              id,
              birthDate,
              firstName,
              forceRefresh,
              lastName,
              middleName,
              position,
              team: {
                id1,
                abbrev,
                active,
                commonName,
                forceRefresh1,
                fullName,
                generalManager,
                location,
              },
              team_id,
            })
          );
        }
      );
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
