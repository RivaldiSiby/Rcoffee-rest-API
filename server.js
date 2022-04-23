require("dotenv").config();
// express
const express = require("express");

// router connect
const mainRouter = require("./src/routes/index");

// config
// middleware
const logger = require("morgan");
// server
const server = express();

const init = async () => {
  try {
    // database check
    console.log("Database Conected");
    // middleware
    server.use(
      logger(":method :url :status :res[content-length] - :response-time ms")
    );
    // handler/middleware urlencoded
    await server.use(express.urlencoded({ extended: false }));

    // handler/middleware raw json
    await server.use(express.json());
    // router
    server.use(mainRouter);
    // start server
    server.listen(process.env.PORT, () => {
      console.log(`Server is Running at port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// server
init();
