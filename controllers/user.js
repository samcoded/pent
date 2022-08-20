const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const login = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {},
    });
};
const register = async (req, res) => {};
const getUser = async (req, res) => {
    const id = req.params.id;
};
const updateUser = async (req, res) => {
    const id = req.params.id;
};
const deleteUser = async (req, res) => {
    const id = req.params.id;
};
const getAllUsers = async (req, res) => {};

// export all
module.exports = {
    login,
    register,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
};
