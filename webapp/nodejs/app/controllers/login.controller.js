const config = require("../config/auth.config");
const db = require("../models");
const Technician = db.technician;
const Admin = db.admin;
const Radiologist = db.radiologist;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = (req, res) => {
    Technician.findOne({ username: req.body.username }).exec((err, technician) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!technician) {
            Admin.findOne({ username: req.body.username }).exec((err, admin) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }
                if (!admin) {
                    Radiologist.findOne({ username: req.body.username }).exec((err, radiologist) => {
                        if (err) {
                            return res.status(500).send({ message: err });
                        }

                        if (!radiologist) {
                            return res.status(404).send({ message: "user Not found" });
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

                        if (!radiologist.active) {
                            return res.status(402).send({
                                accessToken: null,
                                message: "user is not Active!"
                            });
                        }

                        var token = jwt.sign({ id: radiologist.id }, config.secret, {
                            expiresIn: 86400 // 24 hours
                        });

                        res.status(200).send({
                            id: radiologist._id,
                            username: radiologist.username,
                            email: radiologist.email,
                            role: radiologist.role,
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
                    if (!admin.active) {
                        return res.status(402).send({
                            accessToken: null,
                            message: "user is not Active!"
                        });
                    }

                    const token = jwt.sign({ id: admin.id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });

                    res.status(200).send({
                        id: admin._id,
                        username: admin.username,
                        email: admin.email,
                        role: admin.role,
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

            if (!technician.active) {
                return res.status(402).send({
                    accessToken: null,
                    message: "user is not Active!"
                });
            }

            const token = jwt.sign({ id: technician.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
                id: technician._id,
                username: technician.username,
                email: technician.email,
                role: technician.role,
                accessToken: token
            });

        }
    });
};
