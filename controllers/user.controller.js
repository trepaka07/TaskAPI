const User = require("../models/user.model");
const { loginSchema, signupSchema } = require("../validation/schema");
const auth = require("../authentication/auth");

exports.validateUserToken = (req, res, next) => {
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
  const validate = signupSchema.safeParse(req.body);
  if (!validate.success) {
    res.status(400).send({ error: validate.error.flatten().fieldErrors });
    return;
  }

  const user = new User(req.body.username, req.body.email, req.body.password);

  User.create(user, (err, data) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(201).send(data);
    }
  });
};

exports.validate = (req, res) => {
  const validate = loginSchema.safeParse(req.body);
  if (!validate.success) {
    res.status(400).send({ error: validate.error.flatten().fieldErrors });
    return;
  }

  User.validate(req.body.username, req.body.password, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.send(result);
    }
  });
};

exports.delete = (req, res) => {
  User.deleteByUserId(req.user.userId, (err) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(204).send();
    }
  });
};
