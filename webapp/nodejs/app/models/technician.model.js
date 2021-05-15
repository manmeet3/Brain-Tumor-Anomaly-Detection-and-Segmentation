const mongoose = require("mongoose");

const Technician = mongoose.model(
    "Technician",
    new mongoose.Schema({
                            username: String,
                            email: String,
                            password: String,
                            active: Boolean,
                            role: String
                        })
);

module.exports = Technician;
