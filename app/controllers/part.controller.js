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
    const size = Number(req.query.size) || 8;
    const page = Number(req.query.page) || 1;

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
            .sort({ createdAt: -1 })
            .then((data) => {
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
            })
            .catch((err) => {
                res.status(400).send({
                    message: err.message || "Some error occurred while finding records",
                });
            });
    });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};
