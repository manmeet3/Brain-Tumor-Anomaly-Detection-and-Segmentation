const mongoose = require("mongoose");

const Radiologist = mongoose.model(
    "Radiologist",
    new mongoose.Schema({
                            username: String,
                            email: String,
                            password: String,
                            active: Boolean,
                            role: String
                        })
);

module.exports = Radiologist;
