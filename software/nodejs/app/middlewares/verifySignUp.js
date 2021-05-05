const db = require("../models");
const ROLES = db.ROLES;
const Technician = db.technician;
const Admin = db.admin;
const Radiologist = db.radiologist;

checkDuplicateAdmin = (req, res, next) => {
    // Username
    Admin.findOne({
      username: req.body.username
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      }

      // Email
      Admin.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (user) {
          res.status(400).send({ message: "Failed! Email is already in use!" });
          return;
        }

        next();
      });
    });
  };

checkDuplicateTechnician = (req, res, next) => {
  // Username
  Technician.findOne({
                       username: req.body.username
                     }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    Technician.findOne({
                         email: req.body.email
                       }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkDuplicateRadiologist = (req, res, next) => {
  // Username
  Radiologist.findOne({
                       username: req.body.username
                     }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    Radiologist.findOne({
                         email: req.body.email
                       }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

  checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }

    next();
  };
  
  const verifySignUp = {
    checkDuplicateAdmin,
    checkDuplicateTechnician,
    checkDuplicateRadiologist,
    checkRolesExisted
  };
  
  module.exports = verifySignUp;
