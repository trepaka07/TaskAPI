const Task = require("../models/task.model");

exports.create = (req, res) => {
  const task = new Task(
    req.body.name,
    req.body.userId,
    req.body.description,
    req.body.completed,
    req.body.dueDate,
    req.body.priority,
    req.body.category
  );
  Task.create(task, (err, result) => {
    res.send("");
  });
};

exports.findAllByUser = (req, res) => {
  if (!req.body.username) {
    res.status(400).send({ error: "Username required" });
    return;
  }

  Task.findAllByUser(req.username, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.send(result);
    }
  });
};

exports.toggleComplete = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ error: "TaskID required" });
    return;
  }

  Task.toggleComplete(req.body.id, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(200).send(result);
    }
  });
};

exports.deleteById = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ error: "TaskID required" });
    return;
  }

  Task.deleteById(req.body.id, (err) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(204).send();
    }
  });
};
