const bcrypt = require("bcrypt");
const db = require("../database/db");

const User = function (username, email, password) {
  this.username = username;
  this.email = email;
  this.password = password;
};

User.create = (user, result) => {
  const hash = bcrypt.hashSync(user.password, 10);

  db.query(
    `INSERT INTO users (username, email, password) VALUES ('${user.username}', '${user.email}', '${hash}');`,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
      } else {
        const id = res.insertId;
        console.log(`User created successfully with ID ${id}`);
        result(null, { id });
      }
    }
  );
};

User.findByUsername = (username, result) => {
  db.query(
    `SELECT * FROM users WHERE username = '${username}';`,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
      } else if (res.length) {
        console.log(`User found with username ${username}`);
        result(null, res[0]);
      } else {
        result({ error: "User not found", status: 404 }, null);
      }
    }
  );
};

User.getAll = (result) => {
  db.query(`SELECT * FROM users;`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      console.log("Users: ", res);
      result(null, res);
    }
  });
};

User.validate = (username, password, result) => {
  User.findByUsername(username, (err, res) => {
    if (err) {
      if (err.error) {
        result({ error: err.error, status: 404 });
      } else {
        result(err, null);
      }
    } else if (bcrypt.compareSync(password, res.password)) {
      result(null, {}); // TODO: any response here?
    } else {
      result({ error: "Invalid password", status: 401 }, null);
    }
  });
};

module.exports = User;
