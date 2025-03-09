const request = require("supertest");
const server = require("../server");
const { closePool } = require("../database/db");

afterEach(async () => {
  await server.close();
  await closePool();
});

describe("GET /users", () => {
  it("Get all users", async () => {
    const res = await request(server).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.length);
  });
});

describe("POST /users/signup", () => {
  it("Register a new user with valid data", async () => {
    const res = await request(server).post("/users/signup").send({
      username: "TestUser",
      email: "testuser@test.com",
      password: "12345678",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("Register a new user without any data", async () => {
    const res = await request(server).post("/users/signup");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("Register a new user with existing username", async () => {
    const res = await request(server).post("/users/signup").send({
      username: "Trepy",
      email: "trepy@test.com",
      password: "12345678",
    });
    expect(res.statusCode).toBe(303);
    expect(res.body.error).toBeDefined();
  });
});

describe("POST /users/login", () => {
  it("Login with valid data", async () => {
    const res = await request(server).post("/users/login").send({
      username: "TestUser",
      password: "12345678",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Login without any data", async () => {
    const res = await request(server).post("/users/login");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("Login with non-existing user", async () => {
    const res = await request(server).post("/users/login").send({
      username: "NonTestUser",
      password: "12345678",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it("Login with wrong password", async () => {
    const res = await request(server).post("/users/login").send({
      username: "TestUser",
      password: "123456788888",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});

describe("DELETE /users/:username", () => {
  it("Delete user without username", async () => {
    const res = await request(server).delete("/users/delete");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("Delete user with non-existing username", async () => {
    const res = await request(server).delete("/users/delete/NonTestUser");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it("Delete user without JWT", async () => {
    const res = await request(server).delete("/users/delete/TestUser");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("Delete user without invalid JWT", async () => {
    const res = await request(server)
      .delete("/users/delete/TestUser")
      .set("Authorization", `Bearer jhfsjhgndfjklgbjh`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBeDefined();
  });

  it("Delete user with valid data", async () => {
    const loginRes = await request(server).post("/users/login").send({
      username: "TestUser",
      password: "12345678",
    });

    const res = await request(server)
      .delete("/users/delete/TestUser")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBeDefined();
  });
});
