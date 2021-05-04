const mongoose = require("mongoose");

const Patient = mongoose.model(
  "Patient",
  new mongoose.Schema({
    patientName: String,
    patientEmail: String,
  })
);

module.exports = Patient;