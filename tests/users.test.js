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
