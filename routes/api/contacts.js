const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  listContacts().then((data) => {
    res.json(data);
  });
});

router.get("/:contactId", async (req, res, next) => {
  getContactById(req.params.contactId).then((data) => {
    res.json(data);
  });
});

router.post("/", async (req, res, next) => {
  addContact(req.body)
    .then((data) => {
      res.statusCode = 201;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err });
    });
});

router.delete("/:contactId", async (req, res, next) => {
  removeContact(req.params.contactId).then((data) => {
    if (data) {
      res.statusCode = 200;
      res.json({ message: "contact deleted" });
    } else {
      res.statusCode = 404;
      res.json({ message: "Not found" });
    }
  });
});

router.put("/:contactId", async (req, res, next) => {
  updateContact(req.params.contactId, req.body)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.statusCode = 404;
        res.json({ message: "Not found" });
      }
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err });
    });
});

module.exports = router;
