const config = {
  db: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || "3306",
    user: process.env.USER || "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
};

module.exports = config;
