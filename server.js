const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { loginSchema, signupSchema, taskSchema } = require("./schema");
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

const validateUserBody = async (req, schema) => {
  const body = await req.body;
  const validation = schema.safeParse(body);
  return validation.success;
};

const validateSignup = async (req, res, next) => {
  const validate = await validateUserBody(req, signupSchema);
  if (!validate) res.status(400).send(result.error);
  else next();
};

const validateLogin = async (req, res, next) => {
  const validate = await validateUserBody(req, loginSchema);
  if (!validate) res.status(400).send(result.error);
  else next();
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

app.post("/signup", validateSignup, async (req, res) => {
  const body = await req.body;

  pool.getConnection((err, con) => {
    if (err || !con) sendDefaultError(res);
    else {
      const passwordHash = bcrypt.hashSync(body.password, 10);

      con.query(
        `INSERT INTO users (username, email, password) VALUES ('${body.username}', '${body.email}', '${passwordHash}');`,
        (err, result) => {
          if (err) sendDefaultError(res, err); // TODO: more accurate message
          else res.status(201).send(result);
        }
      );
    }
  });
});

app.delete("/users", (req, res) => {});

app.listen(3005, () => console.log(`Listening on PORT ${PORT}...`));
