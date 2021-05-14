const mongoose = require("mongoose");

const Scan = mongoose.model(
  "Scan",
  new mongoose.Schema({
    patientName: String,
    radiologistName: String,
    scanDate: Date,
    patientEmail: String,
    mri: Buffer,
    isProcessed: Boolean
  })
);

module.exports = Scan;