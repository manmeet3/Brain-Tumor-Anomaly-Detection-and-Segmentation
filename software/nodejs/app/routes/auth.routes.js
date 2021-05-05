const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const registerController = require("../controllers/register.controller");
const logInController = require("../controllers/login.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateTechnician,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post(
      "/api/auth/register",
      [
          verifySignUp.checkDuplicateTechnician,
          verifySignUp.checkDuplicateAdmin,
          verifySignUp.checkDuplicateRadiologist,
      ],
      registerController.register
  );

  app.post("/api/auth/signin", controller.signin);
    app.post("/api/auth/login", logInController.login);

};
