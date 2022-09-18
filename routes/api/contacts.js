const express = require("express");
const ctrlTask = require('../../controller');

const router = express.Router();

router.get("/", ctrlTask.get);

router.get("/:contactId", ctrlTask.getById);

router.post("/", ctrlTask.addContact)

router.delete("/:contactId", ctrlTask.removeContact);

router.patch("/:contactId/favorite", ctrlTask.updateFavorite);

router.put("/:contactId", ctrlTask.updateContact);

module.exports = router;
