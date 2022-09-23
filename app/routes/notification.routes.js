const { authJwt } = require("../middlewares");

module.exports = (app) => {
  const controller = require("../controllers/notification.controller");

  const router = require("express").Router();

  router.get("/getForAdmin", [authJwt.isAdmin], controller.getNotiForAdmin);
  router.get("/getMyNoti", controller.getMyNoti);
  router.put("/read/:id", controller.read);
  router.get("/numberOfUnRead", controller.numberOfUnRead);

  app.use("/api/notification", [authJwt.verifyToken], router);
};
