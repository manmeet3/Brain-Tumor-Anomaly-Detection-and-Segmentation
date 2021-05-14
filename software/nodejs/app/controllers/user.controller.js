const db = require("../models");
const Scan = db.scan;
const Patient = db.patient;
const process = require('process');
const redis = require("redis");

const client = redis.createClient();

const subscriber = redis.createClient();
const publisher = redis.createClient();

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

exports.createScan = async (req, res) => {
    // Insert new Scan object
    const scan = new Scan({
        patientName: req.body.patientName,
        radiologistName: req.body.radiologistName,
        scanDate: req.body.scanDate,
        patientEmail: req.body.patientEmail,
        mriPath: process.cwd()+'/uploads/'+req.body.mriPath,
        processedMRIPath: '',
        isProcessed: false
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
        //res.send({ message: "Scan was added successfully!" });
    })
};

exports.viewModelResults = (req,res) =>{
    console.log(req.body.scanId);
    Scan.findOne({_id: req.body.scanId}, (err,scan)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        return res.send({message: scan.processedMRIPath});
    })
}

exports.emailResults = (req,res) =>{
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "neurosignal.reports@outlook.com",
        pass: "neurosignal1234"
    }
    });

    const options = {
    from : "neurosignal.reports@outlook.com",
    to : req.body.patientEmail,
    subject : "What's up NeuroSignal",
    text : "Hi "+req.body.patientName+",\n"+"You Report is ready\n"+"Your scaned dated: "+req.body.scanDate+" curated by "+req.body.radiologistName
    };

    transporter.sendMail(options,function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("Sent :" + info.response);
    })
}

exports.getModelResults = async (req,res) =>{
    Scan.findOne({_id: req.body.scanId}, (err,scan)=>{
        if(err){
            res.status(500).send({ message: err });
            return;
        }
        if(scan){
            subscriber.on("subscribe", function(channel, count) {
            let publish = {"uid": scan._id, "zipfile": scan.mriPath}
            publisher.publish("seg-handler", JSON.stringify(publish));
            //publisher.publish("a channel", "another message");
            });

            subscriber.on("message", function(channel, message) {

            console.log("Subscriber received message in channel '" + channel + "': " + message);
            if (message == "ERROR"){
              console.log("Error processing");
              return
            }
            else{
              var jsonMsg = JSON.parse(message)
              console.log(jsonMsg["uid"]);
              console.log(jsonMsg["output"]);
              scan.processedMRIPath = jsonMsg["output"]
              scan.isProcessed = true
              scan.save();
            }
            });

            subscriber.subscribe("seg-output");
        }
    })
    return res.send({message: "Some data"});
}
