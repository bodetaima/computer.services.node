module.exports = (mongoose) => {
    let schema = mongoose.Schema(
        {
            type: {type: mongoose.Schema.Types.ObjectId, ref: 'PartType'},
            name: String,
            price: Number,
            description: String,
            createdBy: Number,
            updateBy: Number,
            deleted: Boolean,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Part = mongoose.model("Part", schema);

    return Part;
};
