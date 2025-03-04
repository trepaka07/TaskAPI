const express = require("express");
const app = express();
const usersRouter = require("./routers/users.router");
const PORT = 3005;

app.use(express.json());

app.get("/", (req, res) => res.send("TaskAPI is running..."));

app.use("/users", usersRouter);

app.listen(3005, () => console.log(`Listening on PORT ${PORT}...`));
