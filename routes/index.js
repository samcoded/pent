const express = require("express");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the API",
        data: {},
    });
});

module.exports = router;
