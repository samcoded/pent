const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const upload = multer({ dest: os.tmpdir() });
const formMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]); // for parsing form data fields containing video and image

const { verifyToken } = require("../middlewares/verify"); // for verifying token

const {
    login,
    register,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
} = require("../controllers/user");

const {
    createApartment,
    getAllApartments,
    getApartment,
    updateApartment,
    deleteApartment,
} = require("../controllers/apartment");

const {
    createReview,
    getAllReviews,
    getAllReviewsByApartment,
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
router.get("/user", verifyToken, getAllUsers);
router.get("/user/:id", verifyToken, getUser);
router.put("/user/:id", verifyToken, updateUser);
router.delete("/user/:id", verifyToken, deleteUser);

// Apartment routes
router.post("/apartment", verifyToken, createApartment);
router.get("/apartment", verifyToken, getAllApartments);
router.get("/apartment/:id", verifyToken, getApartment);
router.put("/apartment/:id", verifyToken, updateApartment);
router.delete("/apartment/:id", verifyToken, deleteApartment);

// Review routes
router.post(
    "apartment/:apartmentId/review/",
    verifyToken,
    formMiddleware,
    createReview
);
router.get("apartment/:apartmentId/review/", getAllReviewsByApartment);
router.get("/review", getAllReviews);
router.get("/review/:id", getReview);
router.put("/review/:id", verifyToken, formMiddleware, updateReview);
router.delete("/review/:id", verifyToken, deleteReview);
router.put("/review/:id/helpful", verifyToken, markHelpful);

module.exports = router;
