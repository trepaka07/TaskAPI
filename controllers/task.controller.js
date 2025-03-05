const Task = require("../models/task.model");

exports.create = (req, res) => {
  const task = new Task("Test", 1);
  Task.create(task, (err, result) => {
    res.send("");
  });
};
