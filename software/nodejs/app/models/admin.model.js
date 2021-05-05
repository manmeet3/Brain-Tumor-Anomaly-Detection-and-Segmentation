const mongoose = require("mongoose");

const Admin = mongoose.model(
    "Admin",
    new mongoose.Schema({
                            username: String,
                            email: String,
                            password: String,
                            active: Boolean,
                            role: String
                        })
);

module.exports = Admin;
