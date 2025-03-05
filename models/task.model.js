const db = require("../database/db");

// TODO: object as parameter?
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

// TODO: check user exists?
Task.create = (task, result) => {
  const descriptionValue = task.description && `'${task.description}'`;
  const dateValue = task.due_date && `'${task.due_date}'`; // TODO: format it safely
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

Task.toggleComplete = (taskId, result) => {
  Task.findById(taskId, (err, res) => {
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
  Task.findById(task.id, (err) => {
    if (err) {
      result(err, null);
    } else {
      const descriptionValue = task.description && `'${task.description}'`;
      const dateValue = task.due_date && `'${task.due_date}'`; // TODO: format it safely
      const categoryValue = task.category && `'${task.category}'`;

      const sql = `UPDATE tasks SET name = '${task.name}', description = ${descriptionValue}, completed = ${task.completed}, 
        due_date = ${dateValue}, priority = '${task.priority}', category = ${categoryValue} WHERE id = ${task.id};`;

      // TODO: test

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
  Task.findById(taskId, (err) => {
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
