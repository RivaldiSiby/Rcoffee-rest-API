const express = require("express");

const Router = express.Router();

const storeController = require("../controllers/store");
const {
  readStore,
  readStoreById,
  createStore,
  editStoreById,
  deleteStoreById,
} = storeController;

// list router
Router.get("/", readStore);
Router.get("/:id", readStoreById);
Router.post("/", createStore);
Router.put("/:id", editStoreById);
Router.put("/", editStoreById);
Router.delete("/:id", deleteStoreById);
Router.delete("/", deleteStoreById);

module.exports = Router;
