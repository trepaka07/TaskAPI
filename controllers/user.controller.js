const User = require("../models/user.model");

exports.create = (req, res) => {
  // TODO: validate body

  const user = new User(req.body.username, req.body.email, req.body.password);

  User.create(user, (err, data) => {
    if (err) {
      res.status(500).send({ error: "Something went wrong" });
    } else {
      res.status(201).send(data);
    }
  });
};

exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      res.status(500).send({ error: "Something went wrong" });
    } else {
      res.send(data);
    }
  });
};
