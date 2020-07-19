const { authJwt } = require("../middlewares");

module.exports = app => {
    const partTypes = require("../controllers/partType.controller.js");

    let router = require("express").Router();

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    router.post("/", [authJwt.verifyToken, authJwt.isUser], partTypes.create);
    router.get("/", [authJwt.verifyToken, authJwt.isUser], partTypes.findAll);
    router.get("/frontend", partTypes.findAllForFrontEnd);
    router.get("/child", [authJwt.verifyToken, authJwt.isUser], partTypes.findChildType);

    app.use("/api/types", router);
};
