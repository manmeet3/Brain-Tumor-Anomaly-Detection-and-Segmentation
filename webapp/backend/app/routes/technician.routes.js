const {authJwt} = require("../middlewares");
const controller = require("../controllers/user.controller");
const inactiveUserController = require("../controllers/userstates.controller");
const multer = require('multer');

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        console.log(file.originalname);
        callBack(null, file.originalname);
    }
})

var upload = multer({ storage: storage});

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );

  app.post(
    "/api/createScan", upload.single('mriImage'), controller.createScan
  );

  app.post("/api/viewModelResults", controller.viewModelResults);

  app.post("/api/getModelResults", controller.getModelResults);

  app.post("/api/emailResults", controller.emailResults);

  app.get(
      "/api/getScans", controller.getScans
  );

  app.get(
      "/api/getInactiveUsers", inactiveUserController.getInactiveUsers
  );

  app.put(
        "/api/active", inactiveUserController.setUsersActive
  );

};
