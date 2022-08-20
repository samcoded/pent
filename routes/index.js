const express = require("express");
const router = express.Router();

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
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/users", getAllUsers);

// Apartment routes
router.post("/apartment", createApartment);
router.get("/apartments", getAllApartments);
router.get("/apartment/:id", getApartment);
router.put("/apartment/:id", updateApartment);
router.delete("/apartment/:id", deleteApartment);

// Review routes
router.post("/review", createReview);
router.get("/reviews/:apartmentId", getAllReviews);
router.get("/review/:id", getReview);
router.put("/review/:id", updateReview);
router.delete("/review/:id", deleteReview);
router.put("/review/:id/helpful", markHelpful);

module.exports = router;
