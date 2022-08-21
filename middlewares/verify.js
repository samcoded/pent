const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
require("dotenv").config();
const jwtsecret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (token == null) {
            return res
                .status(401)
                .json({ success: false, message: error.message, data: {} });
        }
        let decodedtoken = jwt.verify(token, jwtsecret);
        if (!decodedtoken) {
            return res
                .status(401)
                .json({ success: false, message: error.message, data: {} });
        }

        const user = await UserModel.findById(decodedtoken.id);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found", data: {} });
        }
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(403)
            .json({ success: false, message: error.message, data: {} });
    }
};

module.exports = { verifyToken };
