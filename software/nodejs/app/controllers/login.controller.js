const config = require("../config/auth.config");
const db = require("../models");
const Technician = db.technician;
const Admin = db.admin;
const Radiologist = db.radiologist;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = (req, res) => {
    Technician.findOne({
                           username: req.body.username
                       })
        .exec((err, technician) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (!technician) {


                Admin.findOne({
                                  username: req.body.username
                              })
                    .exec((err, admin) => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }

                        if (!admin) {
                            Radiologist.findOne({
                                                    username: req.body.username
                                                })
                                .exec((err, radiologist) => {
                                    if (err) {
                                        res.status(500).send({message: err});
                                        return;
                                    }

                                    if (!radiologist) {
                                        return res.status(404).send({message: "Technician Not found."});
                                    }

                                    const passwordIsValid = bcrypt.compareSync(
                                        req.body.password,
                                        radiologist.password
                                    );

                                    if (!passwordIsValid) {
                                        return res.status(401).send({
                                                                        accessToken: null,
                                                                        message: "Invalid Password!"
                                                                    });
                                    }

                                    var token = jwt.sign({id: radiologist.id}, config.secret, {
                                        expiresIn: 86400 // 24 hours
                                    });

                                    res.status(200).send({
                                                             id: radiologist._id,
                                                             username: radiologist.username,
                                                             email: radiologist.email,
                                                             roles: radiologist.role,
                                                             accessToken: token
                                                         });
                                });
                           // return res.status(404).send({message: "Technician Not found."});
                        } else {
                            const passwordIsValid = bcrypt.compareSync(
                                req.body.password,
                                admin.password
                            );

                            if (!passwordIsValid) {
                                return res.status(401).send({
                                                                accessToken: null,
                                                                message: "Invalid Password!"
                                                            });
                            }

                            const token = jwt.sign({id: admin.id}, config.secret, {
                                expiresIn: 86400 // 24 hours
                            });

                            res.status(200).send({
                                                     id: admin._id,
                                                     username: admin.username,
                                                     email: admin.email,
                                                     roles: admin.role,
                                                     accessToken: token
                                                 });
                        }
                    });
            } else {
                const passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    technician.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                                                    accessToken: null,
                                                    message: "Invalid Password!"
                                                });
                }

                const token = jwt.sign({id: technician.id}, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                                         id: technician._id,
                                         username: technician.username,
                                         email: technician.email,
                                         roles: technician.role,
                                         accessToken: token
                                     });

            }
        });
};