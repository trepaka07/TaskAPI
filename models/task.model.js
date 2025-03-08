const db = require("../database/db");
const User = require("./user.model");

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
  this.priority = Priority.hasOwnProperty(task.priority)
    ? task.priority
    : Priority.LOW;
  this.category = task.category || null;
};

Task.create = (task, result) => {
  User.findById(task.userId, (err) => {
    if (err) {
      result(err, null);
    } else {
      const descriptionValue = task.description && `'${task.description}'`;
      const dateValue = task.due_date && `'${task.due_date}'`; // TODO: parse safely
      const categoryValue = task.category && `'${task.category}'`;

      const sql = `INSERT INTO tasks (name, description, completed, due_date, priority, category, user_id) 
      VALUES ('${task.name}', ${descriptionValue}, ${task.completed}, ${dateValue}, '${task.priority}', ${categoryValue}, ${task.userId});`;

      db.query(sql, (err, res) => {
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
    }
  });
};

Task.findOneById = (taskId, result) => {
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

Task.findAllByUserId = (userId, result) => {
  User.findById(userId, (err) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      db.query(`SELECT * FROM tasks WHERE user_id = ${userId};`, (err, res) => {
        if (err) {
          console.log("Error: ", err);
          result(err, null);
        } else {
          result(null, res);
        }
      });
    }
  });
};

Task.toggleComplete = (taskId, result) => {
  Task.findOneById(taskId, (err, res) => {
    if (err) {
      result(err, null);
    } else {
      db.query(
        `UPDATE tasks SET complete = 1 - complete WHERE id = ${taskId};`,
        (err) => {
          if (err) {
            result(err, null);
          } else {
            result(null, { complete: 1 - res.complete, ...res }); // TODO: is this ok?
          }
        }
      );
    }
  });
};

Task.update = (task, result) => {
  Task.findOneById(task.id, (err, originalTask) => {
    if (err) {
      result(err, null);
    } else {
      // TODO: parse date
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

      db.query(sql, (err, res) => {
        if (err) {
          result(err, null);
        } else {
          result(null, res);
        }
      });
    }
  });
};

Task.deleteById = (taskId, result) => {
  Task.findOneById(taskId, (err) => {
    if (err) {
      result(err, null);
    } else {
      db.query(`DELETE FROM tasks WHERE id = ${taskId};`, (err) => {
        if (err) {
          result(err, null);
        } else {
          result(null, {}); // TODO: any response here?
        }
      });
    }
  });
};

module.exports = Task;
