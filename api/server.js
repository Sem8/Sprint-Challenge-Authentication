const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const configureRoutes = require("../config/routes.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send(
    `Navigate to /api/register to register, /api/login to log in and /api/jokes to get list of dad jokes after logging in`
  );
});

configureRoutes(server);

module.exports = server;
