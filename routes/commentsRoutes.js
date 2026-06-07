const express = require("express");

const router = express.Router();

const controller = require("../controllers/commentsController");

router.get("/", controller.getAllComments);

router.get("/:id", controller.getCommentById);

router.post("/", controller.createComment);

router.put("/:id", controller.updateComment);

router.delete("/:id", controller.deleteComment);

module.exports = router;