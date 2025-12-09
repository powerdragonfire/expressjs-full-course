import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.js";

describe("create user and login", () => {
  let app: any;
  beforeAll(async () => {
    await mongoose
      .connect("mongodb://localhost/express_tutorial_test")
      .then(() => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should create the user", async () => {
    const response = await request(app).post("/api/users").send({
      username: "adam123",
      password: "password",
      displayName: "Adam The Developer",
    });
    expect(response.statusCode).toBe(201);
  });

  it("should log the user in and visit /api/auth/status and return auth user", async () => {
    const agent = request.agent(app);
    const loginRes = await agent
      .post("/api/auth")
      .send({ username: "adam123", password: "password" });
    expect(loginRes.statusCode).toBe(200);

    const statusRes = await agent.get("/api/auth/status");
    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body.username).toBe("adam123");
    expect(statusRes.body.displayName).toBe("Adam The Developer");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
