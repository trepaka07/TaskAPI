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
