const express = require("express");
const router = express.Router();
const controller = require("../controllers/photosController");

router.get("/", controller.getAllPhotos);
router.get("/:id", controller.getPhotoById);
router.post("/", controller.createPhoto);
router.put("/:id", controller.updatePhoto);
router.delete("/:id", controller.deletePhoto);

module.exports = router;