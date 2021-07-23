const config = {
  db: {
    host: process.env.HOST || "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "demo",
  },
};

module.exports = config;
