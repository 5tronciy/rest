const express = require("express");
const router = require("./router");
const app = express();
const port = 10000;

app.use(express.json());
app.use("/rest", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
