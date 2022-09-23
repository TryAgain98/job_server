const { authJwt } = require("../middlewares")
module.exports = app => {
    const controller = require("../controllers/timekeeping.controller.js")

    const router = require("express").Router()

    router.post("/", controller.create)

    router.get("/", controller.findAll)
    //api/teachers/3
    router.get("/:id", controller.findOne)

    router.put("/:id", controller.update)

    router.delete("/:id", controller.delete)

    router.delete("/", controller.deleteAll)

    router.put("/updateStatus/:id",  [authJwt.isAdmin], controller.updateStatus)

    app.use("/api/timekeeping", [authJwt.verifyToken], router)
}
