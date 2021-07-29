const Router = require("express");
const restController = require("./controller");
const router = new Router();

router.get("/", restController.start);
router.get("/metadata", restController.getMetaData);
router.get("/:table/metadata", restController.getTableMetadata);
router.get("/:table", restController.getAll);
router.get("/:table/:id", restController.getById);
router.post("/:table", restController.create);

module.exports = router;
