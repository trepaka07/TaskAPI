const db = require("../database/db");

const Task = function (
  name,
  userId,
  description = null,
  completed = false,
  due_date = null,
  priority = "Low",
  category = null
) {
  this.name = name;
  this.userId = userId;
  this.description = description;
  this.completed = completed;
  this.due_date = due_date;
  this.priority = priority;
  this.category = category;
};

Task.create = (task, result) => {
  const descriptionValue = task.description && `'${task.description}'`;
  const dateValue = task.due_date && `'${task.due_date}'`;
  const categoryValue = task.category && `'${task.category}'`;

  const sql = `INSERT INTO tasks (name, description, completed, due_date, priority, category, user_id) VALUES ('${task.name}', ${descriptionValue}, ${task.completed}, ${dateValue}, '${task.priority}', ${categoryValue}, ${task.userId});`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      const id = res.insertId;
      console.log(`Task created successfully with ID ${id}`);
      result(null, { id }); // TODO: return object
    }
  });
};

Task.findById = (taskId, result) => {
  db.query(`SELECT * FROM tasks WHERE id = ${taskId};`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else if (res.length) {
      console.log(`Task found with ID ${taskId}`);
      result(null, res[0]);
    } else {
      console.log(`Task not found with ID ${taskId}`);
      result({ error: "Task not found", status: 404 }, null);
    }
  });
};

Task.findAllByUser = (userId, result) => {
  db.query(`SELECT * FROM tasks WHERE user_id = ${userId};`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Task.complete = (taskId, result) => {};
Task.update = (task, result) => {};
Task.deleteById = (taskId, result) => {};

module.exports = Task;
