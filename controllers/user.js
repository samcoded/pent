const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const joi = require("joi");
require("dotenv").config();

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // joi validation
        const schema = joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().required(),
        });

        try {
            await schema.validateAsync({ email, password });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
                data: {},
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            token,
        };
        res.header("auth-token", token).json({
            success: true,
            message: "Login successful",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // joi validation
        const schema = joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required(),
        });

        try {
            await schema.validateAsync({ name, email, password });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: {},
            });
        }

        const newUser = new UserModel({ name, email, password });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const data = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token,
        };
        res.header("auth-token", token).json({
            success: true,
            message: "Registration successful",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id, { password: 0 });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }
        res.json({
            success: true,
            message: "User found",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    try {
        if (!req.user._id.equals(id)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: {},
            });
        }

        // joi validation
        const schema = joi.object().keys({
            name: joi.string(),
            email: joi.string().email(),
        });

        try {
            await schema.validateAsync({ name, email });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        await user.save();
        const data = { id: user._id, name: user.name, email: user.email };
        res.json({
            success: true,
            message: "User updated",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};
const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        if (req.user._id.equals(id)) {
            return res.status(403).json({
                success: false,
                message: "can't delete yourself",
                data: {},
            });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }
        await user.remove();
        res.json({
            success: true,
            message: "User deleted",
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
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.json({
            success: true,
            message: "Users found",
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            data: {},
        });
    }
};

const changePassword = async (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        if (!req.user._id.equals(id)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: {},
            });
        }

        // joi validation
        const schema = joi.object().keys({
            oldPassword: joi.string().required(),
            newPassword: joi.string().required(),
        });

        try {
            await schema.validateAsync({ oldPassword, newPassword });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {},
            });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }
        const isMatch = await user.isValidPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
                data: {},
            });
        }

        user.password = newPassword;
        await user.save();
        res.json({
            success: true,
            message: "Password changed",
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

// export all
module.exports = {
    login,
    register,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    changePassword,
};
