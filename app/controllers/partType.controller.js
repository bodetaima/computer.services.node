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
        name: req.body.name,
        description: req.body.description,
        createdBy: 0,
        updateBy: null,
        deleted: false,
    });

    partType.save((err, partType) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.parentType) {
            PartType.find({ type: req.body.parentType }, (err, parentType) => {
                if (err) {
                    res.status(400).send({ message: err });
                    return;
                }

                partType.parentType = parentType.map((par) => par._id);
                partType.save((err) => {
                    if (err) {
                        res.status(400).send({ message: err });
                        return;
                    }

                    res.send({ message: "Created successfully!", data: partType });
                });
            });
        }
    });
};

exports.findAll = (req, res) => {
    PartType.find({ deleted: false })
        .populate("parentType", "_id type isParentType name description")
        .then((data) => {
            res.send(
                data.map((d) => ({
                    id: d._id,
                    type: d.type,
                    isParentType: d.isParentType,
                    name: d.name,
                    description: d.description,
                    parentType: d.parentType,
                }))
            );
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while finding records",
            });
        });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};
