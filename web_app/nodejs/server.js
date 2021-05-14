const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose.connect("mongodb+srv://ronakmehta:ronakmehta@neurosignaldb.bschz.mongodb.net/NeuroSignal?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                         name: "technician"
                     }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'technician' to roles collection");
            });

            new Role({
                         name: "radiologist"
                     }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'radiologist' to roles collection");
            });

            new Role({
                         name: "admin"
                     }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to NeuroSignal Application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/technician.routes')(app);
require('./app/routes/radiologist.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
