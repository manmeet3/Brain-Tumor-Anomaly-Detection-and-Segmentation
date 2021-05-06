const db = require("../models");
const Radiologist = db.radiologist;
const Technician = db.technician;
const Admin = db.admin;

exports.getInactiveUsers = async (req, res) => {
    const inactiveRadiologist = await Radiologist.find({active: false});
    const inActiveTechnician = await Technician.find({active: false});
    const inActiveAdmin = await Admin.find({active: false});
    const users = inactiveRadiologist.concat(inActiveAdmin, inActiveTechnician);
    res.send(JSON.stringify(users));
}

exports.setUsersActive = (req, res) => {
   // console.log(req.body);

    for (const user of req.body.checkArray) {
        let userRole = user.split(":");
        let query = {username: userRole[0].trim()};
        let newValue = {$set: {active: true}};
        switch (userRole[1].trim()) {
            case "Admin":
                console.log('Admin activated');
                Admin.findOneAndUpdate(query, newValue, function (err, res) {
                    if (err) {
                        throw err;
                    }
                });
                break;
            case "Radiologist":
                console.log('Radiologist activated');
                Radiologist.findOneAndUpdate(query, newValue, function (err, res) {
                    if (err) {
                        throw err;
                    }
                });
                break;
            case "Technician":
                console.log('Technician activated');
                Technician.findOneAndUpdate(query, newValue, function (err, res) {
                    if (err) {
                        throw err;
                    }
                });
                break;
            default:
                break;
        }
    }
}
