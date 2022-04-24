const express = require("express");
const Router = express.Router();

const usersController = require("../controllers/users");

const { readUsers, readUserById, createUser, editUserById, deleteUserById } =
  usersController;

Router.get("/", readUsers);
Router.get("/:id", readUserById);
Router.post("/", createUser);
Router.put("/:id", editUserById);
Router.put("/", editUserById);
Router.delete("/:id", deleteUserById);
Router.delete("/", deleteUserById);

module.exports = Router;
