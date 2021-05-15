const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Technician = db.technician;
const Admin = db.admin;
const Radiologist = db.radiologist;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
};

isAdmin = (req, res, next) => {
    Admin.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        return;
      }
      res.status(403).send({ message: "Require Admin Role!" });
    });
  };
  
  isModerator = (req, res, next) => {
    Technician.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        return;
      }
      res.status(403).send({ message: "Require Radiologist Role!" });
    });
  };
  
  const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
  };
  module.exports = authJwt;
