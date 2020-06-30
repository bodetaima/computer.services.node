const { authJwt } = require("../middlewares");

module.exports = (app) => {
    const parts = require("../controllers/part.controller.js");

    let router = require("express").Router();

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    router.post("/", [authJwt.verifyToken, authJwt.isUser], parts.create);
    router.get("/", [authJwt.verifyToken, authJwt.isUser], parts.findAll);
    router.get("/:id", [authJwt.verifyToken, authJwt.isUser], parts.findOne);
    app.use("/api/parts", router);
};
