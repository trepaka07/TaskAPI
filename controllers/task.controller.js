const Task = require("../models/task.model");
const { taskSchema } = require("../schema");

exports.create = (req, res) => {
  const validate = taskSchema.safeParse(req.body);
  if (!validate.success) {
    res.status(400).send({ error: validate.error.flatten().fieldErrors });
    return;
  }

  const task = new Task(req.body);
  Task.create(task, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(201).send(result);
    }
  });
};

exports.findAllByUserId = (req, res) => {
  if (!req.params.userId) {
    res.status(400).send({ error: "userId required" });
    return;
  }

  Task.findAllByUserId(req.params.userId, (err, result) => {
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
    res.status(400).send({ error: "id required" });
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

exports.update = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ error: "id required" });
    return;
  }

  Task.update(req.body, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.send(result);
    }
  });
};

exports.deleteById = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ error: "id required" });
    return;
  }

  Task.deleteById(req.params.id, (err) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(204).send();
    }
  });
};
