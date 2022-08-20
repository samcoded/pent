const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        video: {
            type: String,
        },
        images: {
            type: String,
        },
        helpful: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        apartment: {
            type: Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
