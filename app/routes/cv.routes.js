module.exports = app => {
    const controller = require("../controllers/cv.controller.js");
  
    const router = require("express").Router();
  
    router.post("/", controller.create);
  
    router.get("/", controller.findAll);

    router.get("/:id", controller.findOne);
  
    router.put("/:id", controller.update);
  
    router.delete("/:id", controller.delete);
  
    router.delete("/", controller.deleteAll);

    router.post("/addPrimaryCV", controller.addPrimaryCV);
  
    app.use("/api/cv", router);
  };
  