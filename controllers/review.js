const AWS = require("aws-sdk");
const fs = require("fs");
const Joi = require("joi");
const ReviewModel = require("../models/review");

const createReview = async (req, res) => {
    const user = req.user;
    const apartmentId = req.params.apartmentId;

    const { rating, landlord, environment, quality_of_amenities } = req.body;

    try {
        // check if apartment exists
        const apartment = await ApartmentModel.findById(apartmentId);
        if (!apartment) {
            return res.status(404).json({
                success: false,
                message: "Apartment not found",
                data: {},
            });
        }

        const payload = {
            rating,
            landlord,
            environment,
            quality_of_amenities,
        };

        // joi validation
        const schema = Joi.object({
            rating: Joi.number().min(1).max(10).required(),
            landlord: Joi.string().required(),
            environment: Joi.string().required(),
            quality_of_amenities: Joi.string().required(),
        });

        try {
            await schema.validateAsync(payload);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }
        if (req.files) {
            if (req.files.video) {
                video = req.files.video[0];
                // upload video to aws s3
                const s3 = new AWS.S3({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                });
                const videoPath = video.path;
                const blob = fs.readFileSync(videoPath);
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: video.originalname,
                    Body: blob,
                };
                const s3Upload = await s3.upload(params).promise();
                payload.video = s3Upload.Location;
            }
            if (req.files.image) {
                image = req.files.image[0];
                // upload images to aws s3
                const s3 = new AWS.S3({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                });
                const imagePath = image.path;
                const blob = fs.readFileSync(imagePath);
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: image.originalname,
                    Body: blob,
                };
                const s3Upload = await s3.upload(params).promise();
                payload.image = s3Upload.Location;
            }
        }

        payload.user = user._id;
        payload.apartment = apartment._id;
        const review = await ReviewModel.create(payload);
        res.json({
            success: true,
            message: "Review created",
            data: review,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const getAllReviews = async (req, res) => {
    try {
        let reviews;

        // sort by number of helpful array
        if (req.query.sort === "helpful") {
            reviews = await ReviewModel.find().sort({ helpful: -1 });
        } else {
            //sort by newest review
            reviews = await ReviewModel.find().sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            message: "Reviews retrieved",
            data: reviews,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const getAllReviewsByApartment = async (req, res) => {
    const apartmentId = req.params.apartmentId;

    try {
        let reviews;
        // sort by number of helpful array
        if (req.query.sort === "helpful") {
            reviews = await ReviewModel.find({ apartment: apartmentId }).sort({
                helpful: -1,
            });
        } else {
            //sort by newest review
            reviews = await ReviewModel.find({ apartment: apartmentId }).sort({
                createdAt: -1,
            });
        }

        res.json({
            success: true,
            message: "Reviews retrieved for apartment",
            data: reviews,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const getReview = async (req, res) => {
    const id = req.params.id;

    try {
        const review = await ReviewModel.findById(id);
        res.json({
            success: true,
            message: "Review retrieved",
            data: review,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const updateReview = async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    const {
        apartment,
        location,
        rating,
        landlord,
        environment,
        quality_of_amenities,
    } = req.body;

    try {
        //find id of the review
        const review = await ReviewModel.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
                data: {},
            });
        }
        //check if the user is the owner of the review
        if (review.user.toString() !== user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: {},
            });
        }

        const payload = {
            apartment,
            location,
            rating,
            landlord,
            environment,
            quality_of_amenities,
        };

        // joi validation
        const schema = Joi.object({
            apartment: Joi.string(),
            location: Joi.string(),
            rating: Joi.number(),
            landlord: Joi.string(),
            environment: Joi.string(),
            quality_of_amenities: Joi.string(),
        });

        try {
            await schema.validateAsync(payload);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }
        if (req.files) {
            if (req.files.video) {
                video = req.files.video[0];
                // upload video to aws s3
                const s3 = new AWS.S3({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                });
                const videoPath = video.path;
                const blob = fs.readFileSync(videoPath);
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: video.originalname,
                    Body: blob,
                };
                const s3Upload = await s3.upload(params).promise();
                payload.video = s3Upload.Location;
            }
            if (req.files.image) {
                image = req.files.image[0];
                // upload images to aws s3
                const s3 = new AWS.S3({
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                });
                const imagePath = image.path;
                const blob = fs.readFileSync(imagePath);
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: image.originalname,
                    Body: blob,
                };
                const s3Upload = await s3.upload(params).promise();
                payload.image = s3Upload.Location;
            }
        }

        const updatedReview = await ReviewModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        res.json({
            success: true,
            message: "Review updated",
            data: updatedReview,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const deleteReview = async (req, res) => {
    const id = req.params.id;

    try {
        const review = await ReviewModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Review deleted",
            data: review,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const markHelpful = async (req, res) => {
    const id = req.params.id;
    const { user } = req;
    try {
        const review = await ReviewModel.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
                data: {},
            });
        }
        const userId = user._id;
        if (review.helpful.includes(userId)) {
            // REMOVE

            const index = review.helpful.indexOf(userId);
            review.helpful.splice(index, 1);
            await review.save();
            return res.status(200).json({
                success: true,
                message: "Review helpful removed",
                data: review,
            });

            // return res.status(400).json({
            //     success: false,
            //     message: "You have already marked this review helpful",
            //     data: {},
            // });
        }
        review.helpful.push(userId);
        await review.save();
        res.status(200).json({
            success: true,
            message: "Review marked helpful",
            data: review,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

module.exports = {
    createReview,
    getAllReviewsByApartment,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    markHelpful,
};
