const db = require("../models");
const Part = db.parts;

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Body cannot be empty!" });
        return;
    }

    const part = new Part({
        name: req.body.name,
        partType: req.body.partType,
        price: req.body.price,
        description: req.body.description,
        createdBy: 0,
        updateBy: null,
        deleted: false,
    });

    part.save(part)
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
    const name = req.query.name;
    const type = req.query.type;
    const nameCondition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    const typeCondition = type ? { "partType.type": { $regex: new RegExp(type), $options: "i" } } : {};

    Part.find({
        $and: [nameCondition, typeCondition, { deleted: false }],
    })
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
