const User = require("../models/user.model");
const { loginSchema, signupSchema } = require("../schema");

exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      res.status(500).send({ error: "Something went wrong" });
    } else {
      res.send(data);
    }
  });
};

exports.create = (req, res) => {
  const validate = signupSchema.safeParse(req.body);
  if (!validate.success) {
    console.log(validate.error.flatten());
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
    console.log(validate.error.flatten());
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
  if (!req.body.username) {
    res.status(400).send({ error: "Username required" });
    return;
  }

  User.deleteByUsername(req.body.username, (err, result) => {
    if (err) {
      res
        .status(err.status || 500)
        .send({ error: err.error || "Something went wrong" });
    } else {
      res.status(204).send();
    }
  });
};
