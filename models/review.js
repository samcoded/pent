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
            min: [1, "Ratings must be between 1 and 10"],
            max: [10, "Ratings must be between 1 and 10"],
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
            type: Schema.Types.ObjectId,
            ref: "Apartment",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
