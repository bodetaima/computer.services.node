module.exports = (mongoose) => {
    let schema = mongoose.Schema(
        {
            partType: Object,
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

    const Part = mongoose.model("part", schema);

    return Part;
};
