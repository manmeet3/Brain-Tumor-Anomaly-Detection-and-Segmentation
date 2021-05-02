const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.technician = require("./technician.model");
db.role = require("./role.model");

db.ROLES = ["technician", "radiologist", "admin"];

module.exports = db;