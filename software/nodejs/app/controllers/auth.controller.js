const config = require("../config/auth.config");
const db = require("../models");
const Technician = db.technician;
const Admin = db.admin;
const Radiologist = db.radiologist;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const technician = new Technician({
                                          username: req.body.username,
                                          email: req.body.email,
                                          password: bcrypt.hashSync(req.body.password, 8)
                                      });

    technician.save((err, technician) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: {$in: req.body.roles}
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    technician.roles = roles.map(role => role._id);
                    technician.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        res.send({message: "Technician was registered successfully!"});
                    });
                }
            );
        } else {
            Role.findOne({name: "technician"}, (err, role) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                technician.roles = [role._id];
                technician.save(err => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    res.send({message: "Technician was registered successfully!"});
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    Technician.findOne({
                           username: req.body.username
                       })
        .exec((err, technician) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            if (!technician) {
                return res.status(404).send({message: "Technician Not found."});
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                technician.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                                                accessToken: null,
                                                message: "Invalid Password!"
                                            });
            }

            var token = jwt.sign({id: technician.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < technician.roles.length; i++) {
                authorities.push("ROLE_" + technician.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                                     id: technician._id,
                                     username: technician.username,
                                     email: technician.email,
                                     roles: authorities,
                                     accessToken: token
                                 });
        });
};
