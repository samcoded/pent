const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        landlord: {
            type: String,
            required: true,
        },
        environment: {
            type: String,
            required: true,
        },
        quality_of_amenities: {
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
        image: {
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
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
