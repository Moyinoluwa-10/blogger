const supertest = require("supertest");
const { connect } = require("./database");
const userModel = require("../models/userModel");
const app = require("../app");

describe("Auth: Signup", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const response = await supertest(app)
      .post("/api/signup")
      .set("content-type", "application/json")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: "johndoes@gmail.com",
        password: "password1",
        username: "johns",
        country: "nigeria",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("first_name", "John");
    expect(response.body.user).toHaveProperty("last_name", "Doe");
    expect(response.body.user).toHaveProperty("email", "johndoes@gmail.com");
    expect(response.body.user).toHaveProperty("username", "johns");
    expect(response.body.user).toHaveProperty("country", "nigeria");
  });

  it("should login a user and retun a token", async () => {
    // create user in the db
    const user = await userModel.create({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@gmail.com",
      password: "password1",
      username: "johnn",
      country: "nigeria",
    });

    // login user
    const response = await supertest(app)
      .post("/api/login")
      .set("content-type", "application/json")
      .send({
        email: "johndoe@gmail.com",
        password: "password1",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});

