const express = require("express");

const Router = express.Router();

const promosController = require("../controllers/promos");
const {
  readPromosAll,
  readPromosById,
  createPromos,
  editPromosById,
  deletePromosById,
} = promosController;

// router list
Router.get("/", readPromosAll);
Router.get("/:id", readPromosById);
Router.post("/", createPromos);
Router.put("/:id", editPromosById);
Router.delete("/:id", deletePromosById);

module.exports = Router;
