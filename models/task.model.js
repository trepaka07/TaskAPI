const { pool } = require("../database/db");

const Priority = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
});

const Task = function (task) {
  this.name = task.name;
  this.userId = task.userId;
  this.description = task.description || null;
  this.completed = task.completed || false;
  this.due_date = task.due_date || null;
  this.priority =
    task.priority && Priority.hasOwnProperty(task.priority.toUpperCase())
      ? task.priority
      : Priority.LOW;
  this.category = task.category || null;
};

Task.create = (task, result) => {
  const descriptionValue = task.description && `'${task.description}'`;
  const dateValue = task.due_date && `'${task.due_date}'`; // TODO: parse safely
  const categoryValue = task.category && `'${task.category}'`;

  const sql = `INSERT INTO tasks (name, description, completed, due_date, priority, category, user_id) 
      VALUES ('${task.name}', ${descriptionValue}, ${task.completed}, ${dateValue}, '${task.priority}', ${categoryValue}, ${task.userId});`;

  pool.query(sql, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      const id = res.insertId;
      console.log(`Task created successfully with ID ${id}`);
      Task.findOneById(id, (err, newTask) => {
        if (err) {
          console.log("Error: ", err);
          result(err, null);
        } else {
          result(null, newTask);
        }
      });
    }
  });
};

Task.findOneById = (taskId, result) => {
  pool.query(`SELECT * FROM tasks WHERE id = ${taskId};`, (err, res) => {
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

Task.findAllByUserId = (userId, result) => {
  pool.query(`SELECT * FROM tasks WHERE user_id = ${userId};`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Task.toggleComplete = (taskId, result) => {
  pool.query(
    `UPDATE tasks SET completed = 1 - completed WHERE id = ${taskId};`,
    (err) => {
      if (err) {
        result(err, null);
      } else {
        pool.query(`SELECT * FROM tasks WHERE id = ${taskId};`, (err, res) => {
          if (err) {
            result(err, null);
          } else {
            result(null, res[0]);
          }
        });
      }
    }
  );
};

Task.update = (task, result) => {
  const descriptionValue =
    task.description || originalTask.description
      ? `'${task.description || originalTask.description}'`
      : null;
  const dateValue =
    task.due_date || originalTask.due_date
      ? `'${task.due_date || originalTask.due_date}'`
      : null; // TODO: parse safely
  const categoryValue =
    task.category || originalTask.category
      ? `'${task.category || originalTask.category}'`
      : null;

  const sql = `UPDATE tasks SET name = '${
    task.name || originalTask.name
  }', description = ${descriptionValue}, completed = ${
    task.completed || originalTask.completed
  }, 
        due_date = ${dateValue}, priority = '${
    task.priority || originalTask.priority
  }', category = ${categoryValue} WHERE id = ${task.id};`;

  pool.query(sql, (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Task.deleteById = (taskId, result) => {
  pool.query(`DELETE FROM tasks WHERE id = ${taskId};`, (err) => {
    if (err) {
      result(err, null);
    } else {
      result(null, {});
    }
  });
};

module.exports = Task;
