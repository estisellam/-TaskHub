const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersController");

router.get("/", controller.getAllUsers);
router.post("/login", controller.login);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.put("/:id/block", controller.toggleBlockUser);

module.exports = router;