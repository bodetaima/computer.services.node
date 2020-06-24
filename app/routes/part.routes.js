module.exports = app => {
    const parts = require("../controllers/part.controller.js");

    let router = require("express").Router();

    router.post("/", parts.create);
    router.get("/", parts.findAll);

    app.use('/api/parts', router);
}
