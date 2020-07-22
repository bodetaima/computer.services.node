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
            PartType.find(
                { $and: [{ type: req.body.parentType }, { isParentType: true }, { deleted: false }] },
                (err, parentType) => {
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
                }
            );
        } else {
            res.send({ message: "Created successfully!", data: partType });
        }
    });
};

exports.findAll = (req, res) => {
    PartType.find({ deleted: false })
        .populate("parentType", "_id type isParentType name description")
        .then((data) => {
            let parentType = data.filter((d) => d.isParentType === true);
            let childType = data.filter((d) => d.isParentType === false);
            let types = [];

            for (let i = 0; i < parentType.length; i++) {
                let child = childType.filter((c) => c.parentType.type === parentType[i].type);
                let parent = {
                    id: parentType[i]._id,
                    type: parentType[i].type,
                    isParentType: parentType[i].isParentType,
                    name: parentType[i].name,
                    description: parentType[i].description,
                    childType: child.map((c) => ({
                        id: c._id,
                        type: c.type,
                        isParentType: c.isParentType,
                        name: c.name,
                        description: c.description,
                    })),
                };

                types.push(parent);
            }

            res.send(types);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while finding records",
            });
        });
};

exports.findAllForFrontEnd = (req, res) => {
    PartType.find({ deleted: false })
        .populate("parentType", "_id type isParentType name description")
        .then((data) => {
            let parentType = data.filter((d) => d.isParentType === true);
            let childType = data.filter((d) => d.isParentType === false);
            let types = [];

            for (let i = 0; i < parentType.length; i++) {
                let child = childType.filter((c) => c.parentType.type === parentType[i].type);
                let parent = {
                    id: parentType[i]._id,
                    type: parentType[i].type,
                    isParentType: parentType[i].isParentType,
                    name: parentType[i].name,
                    description: parentType[i].description,
                    childType: child.map((c) => ({
                        id: c._id,
                        type: c.type,
                        isParentType: c.isParentType,
                        name: c.name,
                        description: c.description,
                    })),
                };

                types.push(parent);
            }

            res.send(types);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while finding records",
            });
        });
};

exports.findChildType = (req, res) => {
    PartType.find({ $and: [{ isParentType: false }, { deleted: false }] })
        .then((data) => {
            let types = data.map((d) => ({
                id: d._id,
                type: d.type,
                isParentType: d.isParentType,
                name: d.name,
                description: d.description,
            }));
            res.send(types);
        })
        .catch((err) => {
            res.status(400).send({
                message: err.message || "Some error occurred while finding records",
            });
        });
};
