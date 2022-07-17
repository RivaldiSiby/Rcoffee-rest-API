require("dotenv").config();
// express
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// time zone WIB
// process.env.TZ = "Asia/Jakarta";

// router connect
const mainRouter = require("./src/routes/index");
const server = express();
// config
// middleware
const logger = require("morgan");
const db = require("./src/config/db");
// server

const init = async (db) => {
  try {
    // conect db
    await db.connect();
    // database check
    console.log("Database Conected");
    // middleware
    if (process.env.STATUS !== "production") {
      await server.use(
        logger(":method :url :status :res[content-length] - :response-time ms")
      );
    }
    // handler/middlaware cookie
    await server.use(cookieParser());
    await server.use(express.static("public"));
    // handler/middleware urlencoded
    await server.use(express.urlencoded({ extended: false }));

    // handler/middleware raw json
    await server.use(express.text());
    await server.use(express.json());

    // pasang cors
    const corsOptions = {
      origin: [
        "http://localhost:3000",
        "https://rcofffee-store.netlify.app",
        "http://localhost:8081",
      ],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
    server.use(cors(corsOptions));
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

init(db);
