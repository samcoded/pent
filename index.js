const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// middleware
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(cors());

// routes
const routes = require("./routes/index");

app.use("/api", routes);

const upload = require("./middlewares/multer"); // for parsing form data fields containing video and image

app.post(
    "/upload",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),
    (req, res) => {
        res.send(req.files);
    }
);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to PENT, Go to /api to see the API",
        data: {},
    });
});

// catch 404 and forward to error handler
app.use((req, res) => {
    return res
        .status(404)
        .json({ success: false, message: "ERROR: Wrong API ROUTE", data: {} });
});

// connect to mongodb server
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
    .finally(() => {
        //start server
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        }).on("error", (err) => {
            console.log(err);
        });
    });
