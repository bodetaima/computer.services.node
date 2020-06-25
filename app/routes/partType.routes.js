module.exports = app => {
    const partTypes = require("../controllers/partType.controller.js");

    let router = require("express").Router();

    router.post("/", partTypes.create);
    router.get("/", partTypes.findAll);

    app.use('/api/types', router);
}
