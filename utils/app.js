const express = require("express");
// const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const specs = require('../services/swagger');

const path = require('path');
require("dotenv").config({path: path.join(__dirname, '../.env')});

const { createToken, deleteToken, checkToken } = require("../services/authentication");
const { errorLogger } = require("../services/errorHandler");

const usersRouter = require("../routes/users");
const shoesRouter = require("../routes/shoes");
const weightsRouter = require("../routes/weights");
const workoutsRouter = require("../routes/workouts");
const weekRouter = require("../routes/week");
const monthRouter = require("../routes/month");

const homeRouter = require('../routes/home');

const app = express();

// Add middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(cookieParser());

//const PORT = process.env.PORT;
//let corsOrigin = "127.0.0.1:" + PORT.toString();

// -> turned off - not sure about deployment settings
// app.use(
//   cors({
//     origin: corsOrigin,
//     credentials: true,
//   })
// );

// app.use(helmet()); // -> turned off - not sure about deployment settings

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, { 
    explorer: true,
    groupingApiBy: ['tag']
}));

app.post("/api/login", createToken);
app.get("/api/logout", deleteToken);

// HTML routes
app.use('/', homeRouter)

// Authentication
app.use(checkToken);

/// API routes
app.use("/api/users", usersRouter);
app.use("/api/shoes", shoesRouter);
app.use("/api/weights", weightsRouter);
app.use("/api/workouts", workoutsRouter);
app.use("/api/week", weekRouter);
app.use("/api/month", monthRouter);

app.use(errorLogger);

module.exports = app;

