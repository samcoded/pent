const AWS = require("aws-sdk");
const fs = require("fs");
const Joi = require("joi");
const ApartmentModel = require("../models/apartment");

const createApartment = async (req, res) => {
    const user = req.user;
    const { name, location } = req.body;

    try {
        const payload = {
            name,
            location,
        };

        // joi validation
        const schema = Joi.object({
            name: Joi.string().required(),
            location: Joi.string().required(),
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
        const apartment = await ApartmentModel.create(payload);
        res.json({
            success: true,
            message: "Apartment created",
            data: apartment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const getAllApartments = async (req, res) => {
    try {
        let apartments;

        //sort by newest apartment
        apartments = await ApartmentModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Apartments retrieved",
            data: apartments,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const getApartment = async (req, res) => {
    const id = req.params.id;

    try {
        const apartment = await ApartmentModel.findById(id);
        res.json({
            success: true,
            message: "Apartment retrieved",
            data: apartment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const updateApartment = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const { name, location } = req.body;

    try {
        //find id of the apartment
        const apartment = await ApartmentModel.findById(id);
        if (!apartment) {
            return res.status(404).json({
                success: false,
                message: "Apartment not found",
                data: {},
            });
        }
        //check if the user is the owner of the apartment
        if (apartment.user.toString() !== user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: {},
            });
        }

        // joi validation
        const schema = Joi.object({
            name: Joi.string(),
            location: Joi.string(),
        });

        try {
            await schema.validateAsync({ name, location });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }
        if (req.files) {
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
                apartment.image = s3Upload.Location;
            }
        }

        if (name) {
            apartment.name = name;
        }
        if (location) {
            apartment.location = location;
        }
        await apartment.save();
        res.json({
            success: true,
            message: "Apartment updated",
            data: apartment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const deleteApartment = async (req, res) => {
    const id = req.params.id;

    try {
        await ApartmentModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Apartment deleted",
            data: {},
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
    createApartment,
    getAllApartments,
    getApartment,
    updateApartment,
    deleteApartment,
};
