const db = require("../models");
const PartType = db.partTypes;

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Body cannot be empty!" });
        return;
    }

    const partType = new PartType({
        type: req.body.type,
        isParentType: req.body.isParentType,
        parentType: req.body.parentType,
        name: req.body.name,
        description: req.body.description,
        createdBy: 0,
        updateBy: null,
        deleted: false,
    });

    partType.save(partType)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating record.",
            });
        });
};

exports.findAll = (req, res) => {
    Part.find({ deleted: false })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while finding records",
            });
        });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};
