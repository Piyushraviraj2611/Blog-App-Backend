const express = require("express");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const app = express();

//app.use(cors({ origin: "https://full-stack-blog-app-frontend.netlify.app" }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Route Imports
const postRoutes = require("./routes/postRoutes");

app.get("/", (req, res) => {
	res.send('<h1>Working Fine. <a href="http://localhost:3000/">Click here</a> to go to frontend.');
	//res.send('<h1>Working Fine. <a href="https://full-stack-blog-app-frontend.netlify.app/">Click here</a> to go to frontend.');
});

app.use("/api/v1/post", postRoutes);

// Middleware for Error Handling
app.use(errorMiddleware);

module.exports = app;

const express = require("express");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const app = express();

//app.use(cors({ origin: "https://full-stack-blog-app-frontend.netlify.app" }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Route Imports
const postRoutes = require("./routes/postRoutes");

app.get("/", (req, res) => {
	res.send('<h1>Working Fine. <a href="http://localhost:3000/">Click here</a> to go to frontend.');
	//res.send('<h1>Working Fine. <a href="https://full-stack-blog-app-frontend.netlify.app/">Click here</a> to go to frontend.');
});

app.use("/api/v1/post", postRoutes);

// Middleware for Error Handling
app.use(errorMiddleware);

module.exports = app;
