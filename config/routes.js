const server = require("express").Router();
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'Secret in routes'

const userdb = require("../database/dbConfig.js");

const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

async function register(req, res) {
  // implement user registration
  // let user = req.body;
  // const hash = bcrypt.hashSync(user.password, 4);
  // user.password = hash;
  // userdb("users")
  //   .where({ username: req.params.username })
  //   .first()
  //   .insert(user)
  //   .then(saved => {
  //     res.status(201).json(saved);
  //   })
  //   .catch(error => {
  //     res.status(500).json(error);
  //   });
  const creds = req.body;
  const { username, password } = creds;

  if(!username || !password) {
    return res.status(400).json({ message: `Submit both username and password when registering `});
  }
  const hash = bcrypt.hashSync(password, 4);
  req.body.password = hash;
  try {
    const [id] = await userdb('users').insert(creds);
    const user = await userdb('users').where({ id }).first();
    const token = generateToken(user);
    res.status(201).json({ user, token });    
  } catch (error) {
    res.status(500).json({ error: `Error while registering user: ${error}`});
  }
};

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
};

generateToken = ({ id, username }) => {
  const payload = {
    subject: id,
    username
  };
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, secret, options)
}
