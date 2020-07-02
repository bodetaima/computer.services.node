const { authJwt } = require("../middlewares");

module.exports = (app) => {
    let router = require("express").Router();

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    const index = (req, res) => {
        res.json({ message: "Hello, this is ExpressJS." });
    };

    router.get("/", [authJwt.verifyToken, authJwt.isUser], index);

    app.use("/api", router);
};
