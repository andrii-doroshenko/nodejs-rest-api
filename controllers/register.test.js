const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const gravatar = require("gravatar");
const { UserModel } = require("../schemas/userSchema");

const { DB_HOST } = process.env;

describe("is registration correct", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_HOST);
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Should return status code 201", async () => {
    const userData = {
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);

    expect(response.statusCode).toBe(201);
  });

  test("Should return email and subscription type String", async () => {
    const userData = {
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(userData);
    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(typeof response.body.email).toBe("string");
    expect(typeof response.body.subscription).toBe("string");
  });

  test("Should handle an error if the data is incorrect", async () => {
    const invalidUserData = {
      email: "invalid_email",
      password: "short",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(invalidUserData);

    expect(response.status).toBe(400);
  });
});
