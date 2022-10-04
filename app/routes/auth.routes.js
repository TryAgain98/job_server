const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.post("/api/user/signUp", controller.signup);

  app.post("/api/user/signIn", controller.signIn);
};
