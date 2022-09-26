module.exports = app => {
    const controller = require("../controllers/job.controller.js");
  
    const router = require("express").Router();
  
    router.post("/", controller.create);
  
    router.get("/", controller.findAll);

    router.get("/:id", controller.findOne);
  
    router.put("/:id", controller.update);
  
    router.delete("/:id", controller.delete);
  
    router.delete("/", controller.deleteAll);

    router.post("/applied", controller.appliedJob);
    
    router.post("/saved", controller.savedJob)
  
    app.use("/api/job", router);
  };
  