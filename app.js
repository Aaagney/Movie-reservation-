const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/db");
const movieRoutes = require("./routes/movieRoutes");
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

app.use("/movies", movieRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;