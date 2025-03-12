const express = require("express");
const router = express.Router();
const users = require("../controllers/user.controller");

router.post("/signup", users.create);

router.post("/login", users.validate);

router.delete("/", users.validateUserToken, users.delete);

module.exports = router;
