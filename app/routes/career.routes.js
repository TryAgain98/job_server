const { authJwt } = require("../middlewares");
module.exports = app => {
    const controller = require("../controllers/career.controller.js");
  
    const router = require("express").Router();
  
    router.post("/", controller.create);
  
    router.get("/", controller.getAll);

    router.get("/:id", controller.findOne);
  
    router.put("/:id", controller.update);
  
    router.delete("/:id", controller.delete);
  
    router.delete("/", controller.deleteAll);
  
    app.use("/api/career", [authJwt.verifyToken], router);
  };
  