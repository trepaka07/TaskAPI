const Task = require("../models/task.model");
const { taskSchema } = require("../schema");
const auth = require("../authentication/auth");

exports.validateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .send({ error: "Authentication failed. Access token not found" });
  } else {
    auth.validateToken(token, (err, user) => {
      if (err) {
        res
          .status(403)
          .send({ error: "Authentication failed. Invalid access token" });
      } else {
        req.user = user;
        next();
      }
    });
  }
};

exports.create = (req, res) => {
  const validate = taskSchema.safeParse(req.body);
  if (!validate.success) {
    res.status(400).send({ error: validate.error.flatten().fieldErrors });
    return;
  }

  if (req.user.userId != req.body.userId) {
    res.status(403).send({ error: "Access denied" });
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

  if (req.user.userId != req.params.userId) {
    res.status(403).send({ error: "Access denied" });
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

// TODO: check JWT user
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

// TODO: check JWT user
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

// TODO: check JWT user
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
