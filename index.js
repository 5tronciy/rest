const { showTables, tableMeta, rowById, addRow } = require("./services/db");

const handler = (data) => console.log(data);

// showTables(handler);

// tableMeta("student", handler);

// rowById("instructor", 76766, handler);

addRow(
  "player",
  {
    first_name: "test",
    last_name: "test",
    position: "D",
    force_refresh: 0,
    team_id: 9,
  },
  handler
);
