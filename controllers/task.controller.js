const { string } = require("zod");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const { taskSchema, idSchema } = require("../validation/schema");
const validateBody = require("../validation/validation");

const sendError = (res, err) => {
  res
    .status(err.status || 500)
    .send({ error: err.error || "Something went wrong" });
};

exports.create = (req, res) => {
  const err = validateBody(taskSchema, req.body);
  if (err) {
    res.status(400).send(err);
    return;
  }

  User.findById(req.user.userId, (err) => {
    if (err) {
      sendError(res, err);
    } else {
      const task = new Task({ userId: req.user.userId, ...req.body });
      Task.create(task, (err, result) => {
        if (err) {
          sendError(res, err);
        } else {
          res.status(201).send(result);
        }
      });
    }
  });
};

exports.findAllByUserId = (req, res) => {
  User.findById(req.user.userId, (err, result) => {
    if (err) {
      sendError(res, err);
    } else {
      Task.findAllByUserId(req.user.userId, (err, result) => {
        if (err) {
          sendError(res, err);
        } else {
          res.send(result);
        }
      });
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
      sendError(res, err);
    } else {
      Task.findOneById(req.body.id, (err, result) => {
        if (err) {
          sendError(res, err);
        } else if (req.user.userId === result.user_id) {
          Task.toggleComplete(req.body.id, (err, result) => {
            if (err) {
              sendError(res, err);
            } else {
              res.send(result);
            }
          });
        } else {
          res.status(403).send({ error: "Access denied" });
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

  User.findById(req.user.userId, (err) => {
    if (err) {
      sendError(res, err);
    } else {
      Task.findOneById(req.body.id, (err, result) => {
        if (err) {
          sendError(res, err);
        } else if (req.user.userId === result.user_id) {
          Task.update(req.body, (err, result) => {
            if (err) {
              sendError(res, err);
            } else {
              res.send(result);
            }
          });
        } else {
          res.status(403).send({ error: "Access denied" });
        }
      });
    }
  });
};

exports.deleteById = (req, res) => {
  const err = validateBody(idSchema, { id: parseInt(req.params.id) || "" });
  if (err) {
    res.status(400).send(err);
    return;
  }

  User.findById(req.user.userId, (err) => {
    if (err) {
      sendError(res, err);
    } else {
      Task.findOneById(req.params.id, (err, result) => {
        if (err) {
          sendError(res, err);
        } else if (req.user.userId === result.user_id) {
          Task.deleteById(req.params.id, (err) => {
            if (err) {
              sendError(res, err);
            } else {
              res.status(204).send();
            }
          });
        } else {
          res.status(403).send({ error: "Access denied" });
        }
      });
    }
  });
};
