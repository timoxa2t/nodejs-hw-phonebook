const express = require("express");
const ctrlTask = require('../../controllers/users');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(process.cwd() , "tmp"));
	},
	filename: (req, file, cb) => {
        const {_id} = req.user
        const newFileName = _id + file.originalname.match(/\..+/)[0]
		cb(null, newFileName);
	},
	limits: {
		fileSize: 1048576,
	},
});

const upload = multer({
	storage: storage,
});

const router = express.Router();

router.post("/logout", ctrlTask.logoutUser)

router.get("/current", ctrlTask.getCurrentUser)

router.patch("/avatars", upload.single('avatar'), ctrlTask.changeUserAvatar)

router.patch("/", ctrlTask.changeUserSubscription)


module.exports = router;
