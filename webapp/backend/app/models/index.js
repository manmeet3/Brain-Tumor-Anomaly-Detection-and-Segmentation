const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.technician = require("./technician.model");
db.admin = require("./admin.model");
db.radiologist = require("./radiologist.model");
db.role = require("./role.model");
db.scan = require("./scan.model");
db.patient = require("./patient.model");

db.ROLES = ["technician", "radiologist", "admin"];

module.exports = db;
