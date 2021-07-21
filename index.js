const { showTables, tableMeta, rowById } = require("./services/db");

const handler = (data) => console.log(data);

showTables(handler);

tableMeta("instructor", handler);

rowById("instructor", 76766, handler);
