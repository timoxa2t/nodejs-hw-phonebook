const express = require("express");
const ctrlTask = require('../../controllers/users');

const router = express.Router();

router.post("/logout", ctrlTask.logoutUser)

router.get("/current", ctrlTask.getCurrentUser)

router.patch("/", ctrlTask.changeUserSubscription)


module.exports = router;
