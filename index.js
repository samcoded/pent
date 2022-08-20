const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/index");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api", routes);

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
