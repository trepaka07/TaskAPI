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
    console.log(validate.error); // TODO: send specific error
    res.status(400).send("Invalid user data");
    return;
  }

  const user = new User(req.body.username, req.body.email, req.body.password);

  // TODO: send status code with error is fine?
  User.create(user, (err, data) => {
    if (err) {
      if (err.error) {
        res.status(err.status).send({ error: err.error });
      } else {
        res.status(500).send({ error: "Something went wrong" });
      }
    } else {
      res.status(201).send(data);
    }
  });
};

exports.validate = (req, res) => {
  const validate = loginSchema.safeParse(req.body);
  if (!validate.success) {
    console.log(validate.error); // TODO: send specific error
    res.status(400).send("Invalid user data");
    return;
  }

  User.validate(req.body.username, req.body.password, (err) => {
    if (err) {
      if (err.error) {
        res.status(err.status).send({ error: err.error });
      } else {
        res.status(500).send({ error: "Something went wrong" });
      }
    } else {
      res.send({});
    }
  });
};
