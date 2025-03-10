const request = require("supertest");
const server = require("../server");
const { closePool } = require("../database/db");

afterAll(async () => {
  await server.close();
  await closePool();
});

let loginRes;

describe("GET /tasks", () => {
  it("Get all tasks with valid user data", async () => {
    loginRes = await request(server).post("/users/login").send({
      username: "Trepy",
      password: "12345678",
    });

    const res = await request(server)
      .get("/tasks")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toBe(200);

    expect(res.body).toBeDefined();
  });

  it("Get all task without JWT", async () => {
    const res = await request(server).get("/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("Get all tasks with invalid JWT", async () => {
    const res = await request(server)
      .get("/tasks")
      .set("Authorization", `Bearer fgjfdsjghndfjkgbj`);
    expect(res.statusCode).toBe(403);

    expect(res.body.error).toBeDefined();
  });
});

let newRes;
let newRes2;

describe("POST /tasks/new", () => {
  it("Create a new task with valid data (just name)", async () => {
    newRes = await request(server)
      .post("/tasks/new")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send({ name: "TestTask1" });
    expect(newRes.statusCode).toBe(201);
    expect(newRes.body.id).toBeDefined();
  });

  it("Create a new task with valid data", async () => {
    newRes2 = await request(server)
      .post("/tasks/new")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send({
        name: "TestTask2",
        description: "This is a test description",
        completed: true,
        due_date: "2025-03-15",
        priority: "Medium",
        category: "work",
      });
    expect(newRes2.statusCode).toBe(201);
    expect(newRes2.body.id).toBeDefined();
  });

  it("Create a new task without JWT", async () => {
    const res = await request(server)
      .post("/tasks/new")
      .send({ name: "TestTask1" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("Create a new task with invalid JWT", async () => {
    const res = await request(server)
      .post("/tasks/new")
      .set("Authorization", `Bearer jfsdbfkgnfdsjgbnk`)
      .send({ name: "TestTask1" });
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBeDefined();
  });

  it("Create a new task without name", async () => {
    const res = await request(server)
      .post("/tasks/new")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send({ description: "Wrong task description" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("DELETE /tasks/:id", () => {
  it("Delete task without JWT", async () => {
    const res = await request(server).delete(`/tasks/${newRes.body.id}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("Delete task with invalid JWT", async () => {
    const res = await request(server)
      .delete(`/tasks/${newRes.body.id}`)
      .set("Authorization", `Bearer fgjhsgbjkfdnk`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBeDefined();
  });

  it("Delete tasks with valid data", async () => {
    const res = await request(server)
      .delete(`/tasks/${newRes.body.id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    const res2 = await request(server)
      .delete(`/tasks/${newRes2.body.id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toBe(204);
    expect(res2.statusCode).toBe(204);
  });

  it("Delete task with non-existing id", async () => {
    const res = await request(server)
      .delete(`/tasks/${newRes.body.id}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toBe(404);
  });
});
