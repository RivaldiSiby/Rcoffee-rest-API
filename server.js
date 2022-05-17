require("dotenv").config();
// express
const express = require("express");
const bodyParser = require("body-parser");

// time zone WIB
// process.env.TZ = "Asia/Jakarta";

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
    await server.use(
      logger(":method :url :status :res[content-length] - :response-time ms")
    );
    await server.use(express.static("public"));
    // handler/middleware urlencoded
    await server.use(express.urlencoded({ extended: false }));

    // handler/middleware raw json
    await server.use(express.text());
    await server.use(express.json());
    // router
    await server.use(mainRouter);

    // start server
    await server.listen(process.env.PORT, () => {
      console.log(`Server is Running at port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// server
init();
