module.exports = app => {
    const controller = require("../controllers/cv.controller.js");
  
    const router = require("express").Router();
  
    router.post("/", controller.create);
  
    router.get("/", controller.findAll);

    //api/teachers/3
    router.get("/:id", controller.findOne);
  
    router.put("/:id", controller.update);
  
    router.delete("/:id", controller.delete);
  
    router.delete("/", controller.deleteAll);
  
    app.use("/api/cv", router);
  };
  