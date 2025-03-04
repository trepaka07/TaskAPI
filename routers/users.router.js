const express = require("express");
const router = express.Router();
const users = require("../controllers/user.controller");

router.get("/", users.getAll);

router.post("/signup", users.create);

module.exports = router;
