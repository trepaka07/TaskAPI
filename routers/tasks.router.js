const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task.controller");

router.post("/new", tasks.create);

module.exports = router;
