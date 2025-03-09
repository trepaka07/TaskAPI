const Task = require("../models/task.model");
const User = require("../models/user.model");
const { taskSchema, idSchema } = require("../validation/schema");
const validateBody = require("../validation/validation");

// TODO: finish
exports.validateAccess = (req, res, next) => {
  User.findById(req.user.userId, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      const validateError = validateBody();
      Task.findOneById(req.body.id);
    }
  });
};

exports.create = (req, res) => {
  const err = validateBody(taskSchema, req.body);
  if (err) {
    res.status(400).send(err);
    return;
  }

  const task = new Task({ userId: req.user.userId, ...req.body });
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
  Task.findAllByUserId(req.user.userId, (err, result) => {
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
  const err = validateBody(idSchema, req.body);
  if (err) {
    res.status(400).send(err);
    return;
  }

  User.findById(req.user.userId, (err) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      Task.toggleComplete(req.body.id, (err, result) => {
        if (err) {
          res
            .status(err.status || 500)
            .send({ error: err.error || "Something went wrong" });
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
};

exports.update = (req, res) => {
  const err = validateBody(idSchema, req.body);
  if (err) {
    res.status(400).send(err);
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
  const err = validateBody(idSchema, req.params);
  if (err) {
    res.status(400).send(err);
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
