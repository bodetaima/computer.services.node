module.exports = (mongoose) => {

    let schema = mongoose.Schema(
        {
            type: String,
            isParentType: Boolean,
            parentType: {type: mongoose.Schema.Types.ObjectId, ref: 'PartType'},
            name: String,
            description: String,
            createdBy: Number,
            updateBy: Number,
            deleted: Boolean,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const PartType = mongoose.model("PartType", schema);

    return PartType;
};
