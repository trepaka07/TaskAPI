const bcrypt = require("bcrypt");
const { pool } = require("../database/db");
const auth = require("../authentication/auth");

const User = function (username, email, password) {
  this.username = username;
  this.email = email;
  this.password = password;
};

User.create = (user, result) => {
  const hash = bcrypt.hashSync(user.password, 10);

  pool.query(
    `SELECT * FROM users WHERE username = ${user.username} OR email = ${user.email};`,
    (err, res) => {
      if (err) {
        result(err, null);
      } else if (res.length && res.length > 0) {
        result({ error: "User already exists", status: 303 });
      } else {
        pool.query(
          `INSERT INTO users (username, email, password) VALUES ('${user.username}', '${user.email}', '${hash}');`,
          (err, res) => {
            if (err) {
              console.log("Error: ", err);
              result(err, null);
            } else {
              const id = res.insertId;
              console.log(`User created successfully with ID ${id}`);
              const token = auth.generateToken({
                userId: id,
              });
              result(null, { token, id, username: user.username });
            }
          }
        );
      }
    }
  );
};

User.findById = (id, result) => {
  pool.query(`SELECT * FROM users WHERE id = ${id};`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else if (res.length && res.length > 0) {
      console.log(`User found with ID ${id}`);
      result(null, res[0]);
    } else {
      result({ error: "User not found", status: 404 }, null);
    }
  });
};

User.findByUsername = (username, result) => {
  pool.query(
    `SELECT * FROM users WHERE username = '${username}';`,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
      } else if (res.length && res.length > 0) {
        console.log(`User found with username ${username}`);
        result(null, res[0]);
      } else {
        result({ error: "User not found", status: 404 }, null);
      }
    }
  );
};

User.getAll = (result) => {
  pool.query(`SELECT * FROM users;`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
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
      const token = auth.generateToken({ userId: res.id });
      result(null, { token, id: res.id, username });
    } else {
      result({ error: "Invalid password", status: 401 }, null);
    }
  });
};

User.deleteByUserId = (userId, password, result) => {
  User.findById(userId, (err, res) => {
    if (err) {
      result(err, null);
    } else if (!bcrypt.compareSync(password, res.password)) {
      result({ error: "Invalid password", status: 401 }, null);
    } else {
      pool.query(`DELETE FROM users WHERE id = ${userId};`, (err) => {
        if (err) {
          result(err, null);
        } else {
          result(null, {});
        }
      });
    }
  });
};

module.exports = User;
