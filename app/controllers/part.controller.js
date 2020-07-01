const db = require("../models");
const Part = db.parts;
const PartType = db.partTypes;

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Body cannot be empty!" });
        return;
    }

    const part = new Part({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        createdBy: 0,
        updateBy: null,
        deleted: false,
    });

    part.save((err, part) => {
        if (err) {
            res.status(400).send({ message: err });
            return;
        }

        if (req.body.type) {
            PartType.find(
                { $and: [{ type: req.body.type }, { isParentType: false }, { deleted: false }] },
                (err, partType) => {
                    if (err) {
                        res.status(400).send({ message: err });
                        return;
                    }

                    part.type = partType.map((type) => type._id);
                    part.save((err) => {
                        if (err) {
                            res.status(400).send({ message: err });
                            return;
                        }

                        res.send({ message: "Created successfully!", data: part });
                    });
                }
            );
        }
    });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    const type = req.query.type;
    const size = Number(req.query.size) || 5;
    const page = Number(req.query.page) || 1;
    const sort = req.query.sort;

    let sortCondition = {};

    if (sort === "priceAsc") {
        sortCondition = { price: 1 };
    } else if (sort === "priceDesc") {
        sortCondition = { price: -1 };
    } else if (sort === "createdAsc") {
        sortCondition = { createdAt: 1 };
    } else {
        sortCondition = { createdAt: -1 };
    }

    PartType.find(type ? { type: { $in: type.split(",") } } : {}, async (err, type) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        let typeIdList = type.map((t) => t._id);

        const nameCondition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

        const numOfDocuments = await Part.countDocuments({
            $and: [nameCondition, { type: { $in: typeIdList } }, { deleted: false }],
        });

        Part.find({
            $and: [nameCondition, { type: { $in: typeIdList } }, { deleted: false }],
        })
            .skip(size * page - size)
            .limit(size)
            .populate("type", "_id type name description")
            .sort(sortCondition)
            .then((data) => {
                if (!data) {
                    res.status(400).send({ message: "Not found any part." });
                } else {
                    let parts = data.map((d) => ({
                        id: d._id,
                        name: d.name,
                        type: d.type,
                        price: d.price,
                        description: d.description,
                    }));

                    let response = {
                        parts: parts,
                        size: Number(size),
                        page: Number(page),
                        totalPages: Math.ceil(Number(numOfDocuments) / Number(size)),
                    };

                    res.send(response);
                }
            })
            .catch((err) => {
                res.status(400).send({
                    message: err.message || "Some error occurred while finding records",
                });
            });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Part.findById(id)
        .populate("type", "_id type name description")
        .then((data) => {
            if (!data) {
                res.status(400).send({ message: "Not found any Part with id " + id });
            } else {
                res.send({
                    id: data._id,
                    name: data.name,
                    type: data.type,
                    price: data.price,
                    description: data.description,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!",
        });
    }

    const id = req.params.id;

    Part.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            console.log(data);
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Part with id=${id}. Maybe Part was not found!`,
                });
            } else {
                res.send({ message: "Tutorial was updated successfully." });
            }
        })
        .catch((err) => {
            res.status(500).send(
                {
                    message: "Error updating Part with id=" + id,
                } || { message: err }
            );
        });
};
