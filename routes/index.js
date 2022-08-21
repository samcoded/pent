const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");
const upload = multer({ dest: os.tmpdir() });
const formMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]);

const { verifyToken } = require("../middlewares/verify");

const {
    login,
    register,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
} = require("../controllers/user");

const {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    markHelpful,
} = require("../controllers/review");

// welcome route
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the API",
        data: {},
    });
});

// User routes
router.post("/login", login);
router.post("/register", register);
router.get("/user/:id", getUser);
router.put("/user/:id", verifyToken, updateUser);
router.delete("/user/:id", deleteUser);
router.get("/users", getAllUsers);

// Review routes

router.post("/review", verifyToken, formMiddleware, createReview);
router.get("/reviews", getAllReviews);
router.get("/review/:id", getReview);
router.put("/review/:id", verifyToken, formMiddleware, updateReview);
router.delete("/review/:id", verifyToken, deleteReview);
router.put("/review/:id/helpful", verifyToken, markHelpful);

module.exports = router;
