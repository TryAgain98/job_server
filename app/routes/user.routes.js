const controller = require("../controllers/user.controller")
const router = require("express").Router()
const { authJwt } = require("../middlewares");

module.exports = function (app) {

  router.get("/", controller.findAll)
  router.get("/getForSelector", controller.getForSelector)

  router.post("/", controller.create);
  router.get("/:id", controller.findOne)

  router.post("/updatePassWord", controller.updatePassWord)
  router.post("/resetPassWord", controller.resetPassWord)

  router.put("/:id", controller.update)

  router.delete("/:id", controller.delete)

  router.delete("/", controller.deleteAll)

  app.use("/api/user", router)
  // app.use("/api/user", [authJwt.verifyToken], router)
}
