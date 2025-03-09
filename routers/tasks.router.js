const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task.controller");
const users = require("../controllers/user.controller");

router.use(users.validateUserToken);

router.get("/:userId", tasks.findAllByUserId);

router.post("/new", tasks.create);

router.put("/completed", tasks.toggleComplete);

router.put("/update", tasks.update);

router.delete("/:id", tasks.deleteById);

module.exports = router;
