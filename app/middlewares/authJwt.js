const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const db = require("../models");
const User = db.user;

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } 
  return null;
}

verifyToken = (req, res, next) => {
  const token = getToken(req)
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;

    next();
  });
};

isAdmin = (req, res, next) => {
  if(!req.isAdmin) {
    res.status(403).send({
      message: "Require Admin Role!"
    });
    return;
  }
  next()
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;
