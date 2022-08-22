const express = require("express");
const router = express.Router();

// for parsing form data fields containing video and image
const upload = require("../middlewares/multer");
// const uploadVideo = upload.fields([{ name: "video", maxCount: 1 }]);
const uploadImage = upload.fields([{ name: "image", maxCount: 1 }]);
const uploadBoth = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]);

const { verifyToken } = require("../middlewares/verify"); // for verifying token

const {
    login,
    register,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    changePassword,
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
router.patch("/user/:id", verifyToken, updateUser);
router.delete("/user/:id", verifyToken, deleteUser);
router.patch("/user/:id/password", verifyToken, changePassword);

// Apartment routes
router.post("/apartment", verifyToken, uploadImage, createApartment);
router.get("/apartment", verifyToken, getAllApartments);
router.get("/apartment/:id", verifyToken, getApartment);
router.patch("/apartment/:id", verifyToken, uploadImage, updateApartment);
router.delete("/apartment/:id", verifyToken, deleteApartment);

// Review routes
router.get(
    "/apartment/:apartmentId/review",
    verifyToken,
    getAllReviewsByApartment
);

router.post(
    "/apartment/:apartmentId/review",
    verifyToken,
    uploadBoth,
    createReview
);

router.get("/review", verifyToken, getAllReviews);
router.get("/review/:id", verifyToken, getReview);
router.patch("/review/:id", verifyToken, uploadBoth, updateReview);
router.delete("/review/:id", verifyToken, deleteReview);
router.patch("/review/:id/helpful", verifyToken, markHelpful);

module.exports = router;
