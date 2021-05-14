const db = require("../models");
const Patient = db.patient;

exports.getPatients = async (req, res) => {
    const patients = await Patient.find();
    res.send(patients);
}