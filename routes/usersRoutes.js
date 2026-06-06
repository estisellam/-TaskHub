const express = require("express");

const router = express.Router();

const usersController =require("../controllers/usersController");

const authenticate =require("../middleware/authMiddleware");


router.get(
    "/",usersController.getAllUsers
);

router.get(
    "/:id",usersController.getUserById
);

router.post(
    "/",usersController.createUser
);

router.put(
    "/:id",usersController.updateUser
);

router.delete(
    "/:id",
    authenticate,
    usersController.deleteUser
);

module.exports = router;