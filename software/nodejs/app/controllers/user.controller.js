const db = require("../models");
const Scan = db.scan;
const Patient = db.patient;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
  
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
  
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
  
exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.getScans = async (req,res) => {
    const scans = await Scan.find();
    res.send(scans);
}

exports.createScan = (req, res) => {
    // Insert new Scan object
    const scan = new Scan({
        patientName: req.body.patientName,
        radiologistName: req.body.radiologistName,
        scanDate: req.body.scanDate,
        patientEmail: req.body.patientEmail,
        mri: req.body.mri
    });

    scan.save((err, scan) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
    });

    // Check if patient already exist in database or insert new Patient record if not found
    Patient.findOne({ patientEmail: req.body.patientEmail }, (err,patient)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        if(!patient){
            const patient = new Patient({
                patientName: req.body.patientName,
                patientEmail: req.body.patientEmail
            });
            patient.save((err, patient) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
            });
        }
        res.send({ message: "Scan was added successfully!" });
    })
};


