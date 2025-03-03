const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const {
  loginSchema,
  signupSchema,
  taskSchema,
  userSchema,
} = require("./schema");
const PORT = 3005;

require("dotenv").config();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// TODO: handle query errors

const sendDefaultError = (res, message = "Something went wrong") =>
  res.status(500).send({ error: message });

const validateSignup = async (req, res, next) => {
  const validate = signupSchema.safeParse(req.body);
  if (!validate.success) {
    console.log(validate.error);
    res.status(400).send({ error: "Invalid input" });
  } else next();
};

const validateLogin = async (req, res, next) => {
  const validate = loginSchema.safeParse(req.body);
  if (!validate.success) res.status(400).send({ error: "Invalid input" });
  else next();
};

// TODO: use this
const getConnection = async () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if (err || !con) reject(err);
      else resolve(con); // TODO: check affected rows count
    });
  });

// TODO: merge
const userExists = async (req, res, next) => {
  const validate = userSchema.safeParse(req.body);
  if (!validate.success) {
    console.log(validate.error);
    res.status(400).send({ error: "Invalid input" });
    return;
  }

  pool.getConnection((err, con) => {
    if (err || !con) sendDefaultError(res);
    else {
      con.query(
        `SELECT * FROM users WHERE username = '${req.body.username}';`,
        (err, result) => {
          if (err) sendDefaultError(res);
          else if (result && result.length > 0) next();
          else res.status(404).send({ error: "User not found" });
        }
      );
    }
  });
};

const userNotExists = async (req, res, next) => {
  const validate = userSchema.safeParse(req.body);
  if (!validate.success) {
    console.log(validate.error);
    res.status(400).send({ error: "Invalid input" });
    return;
  }

  pool.getConnection((err, con) => {
    if (err || !con) sendDefaultError(res);
    else {
      con.query(
        `SELECT * FROM users WHERE username = '${req.body.username}';`,
        (err, result) => {
          if (err) sendDefaultError(res);
          else if (result && result.length > 0)
            res.status(409).send({ error: "User already exists" });
          else next();
        }
      );
    }
  });
};

app.use("/users", userExists);

app.get("/", (req, res) => res.send("TaskAPI is running..."));

app.get("/tasks", (req, res) => {
  pool.getConnection((err, con) => {
    if (err || !con) sendDefaultError(res);
    else {
      con.query("SELECT * FROM tasks;", (err, result) => {
        if (err) sendDefaultError(res);
        else res.send(result);
      });
    }
  });
});

app.post("/signup", [validateSignup, userNotExists], async (req, res) => {
  const body = await req.body;

  pool.getConnection((err, con) => {
    if (err || !con) sendDefaultError(res);
    else {
      const hash = bcrypt.hashSync(password, 10);
      con.query(
        `INSERT INTO users (username, email, password) VALUES ('${body.username}', '${body.email}', '${hash}');`,
        (err, result) => {
          if (err) sendDefaultError(res, err); // TODO: more accurate message
          else res.status(201).send(result);
        }
      );
    }
  });
});

app.post("/login", [validateLogin, userExists], (req, res) => {
  pool.getConnection((err, con) => {
    if (err || !con) sendDefaultError(res);
    else {
      con.query(
        `SELECT * FROM users WHERE username = '${req.body.username}';`, // TODO: get the user from the middleware
        (err, result) => {
          if (!err && result && result.length > 0) {
            if (bcrypt.compareSync(req.body.password, result[0].password))
              res.send({ data: "Access granted" });
            else res.status(401).send({ error: "Invalid password" });
          } else sendDefaultError(res, err); // TODO: more accurate message
        }
      );
    }
  });
});

app.delete("/users", (req, res) => {});

app.listen(3005, () => console.log(`Listening on PORT ${PORT}...`));
