const db = require("../models");
const Technician = db.technician;
const Radiologist = db.radiologist;
const Admin = db.admin;
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
    let user = null;
    switch (req.body.role) {
        case "Admin":
            user = new Admin({
                                 username: req.body.username,
                                 email: req.body.email,
                                 password: bcrypt.hashSync(req.body.password, 8),
                                 role: req.body.role,
                                 active: false
                             });
            break;
        case "Radiologist":
            user = new Radiologist({
                                       username: req.body.username,
                                       email: req.body.email,
                                       password: bcrypt.hashSync(req.body.password, 8),
                                       role: req.body.role,
                                       active: false
                                   });
            break;
        case "Technician":
            user = new Technician({
                                      username: req.body.username,
                                      email: req.body.email,
                                      password: bcrypt.hashSync(req.body.password, 8),
                                      role: req.body.role,
                                      active: false
                                  });
            break;
        default:
            break;
    }

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        } else {
            res.send({message: "user was registered successfully as" + req.body.role});
        }
    });
};
