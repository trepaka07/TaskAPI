const express = require("express");
const router = express.Router();
const users = require("../controllers/user.controller");

router.get("/", users.getAll); // TODO: remove

router.post("/signup", users.create);

router.post("/login", users.validate);

router.delete("/:username", users.validateUserToken, users.delete);

module.exports = router;
