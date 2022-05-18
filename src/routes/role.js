const express = require("express");

const Router = express.Router();
const roleController = require("../controllers/role");
const auth = require("../middlewares/auth/auth");
const owner = require("../middlewares/auth/owner");
// router role
Router.get("/", auth.checkToken, auth.checkRole, roleController.readRole);
Router.get(
  "/:id",
  auth.checkToken,
  auth.checkRole,
  roleController.readRoleById
);
Router.post("/", owner.checkOwnerCode, roleController.creatRole);
Router.delete("/:id", owner.checkOwnerCode, roleController.deleteRole);

module.exports = Router;
