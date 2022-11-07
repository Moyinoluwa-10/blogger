const supertest = require("supertest");
const app = require("../app");
const blogModel = require("../models/blogModel");
const { connect } = require("./database");

describe("Blog Route", () => {
  let conn;

  const user = {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    password: "password1",
    username: "johnn",
    country: "nigeria",
  };

  const blog = {
    title: "Like father like son",
    description: "Train up your children",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus architecto enim cum tempore autem at, porro ad et nisi vel delectus aliquid!.",
    tags: "train father son",
  };

  beforeAll(async () => {
    conn = await connect();

    const signupResponse = await supertest(app).post("/signup").send(user);

    const loginResponse = await supertest(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        email: user.email,
        password: user.password,
      });

    token = loginResponse.body.token;
    userId = loginResponse.body.user._id;
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should create blog", async () => {
    const response = await supertest(app)
      .post("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json")
      .send(blog);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("true");
    expect(response.body.blog).toHaveProperty("title");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog).toHaveProperty("reading_time");
    expect(response.body.blog).toHaveProperty("author");
    expect(response.body.blog).toHaveProperty("createdAt");
    expect(response.body.blog.state).toBe("draft");
    expect(response.body.blog.read_count).toBe(0);
  });

  it("should get a list of user blogs", async () => {
    const blog = await blogModel.create(blog);

    blogId = blog._id.toString();

    const response = await supertest(app).get("/api/blog/user" + blogId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "true");
    expect(response.body).toHaveProperty("blogs");
  });

  it("should get a particular blog", async () => {
    const blog = await blogModel.create(blog);

    blogId = blog._id.toString();

    const response = await supertest(app).get("/api/blog" + blogId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "true");
    expect(response.body).toHaveProperty("blog");
  });

  it("should update blog", async () => {
    const blog = await blogModel.create(blog);

    blogId = blog._id.toString();

    const response = await supertest(app)
      .patch("/api/blog/" + blogId)
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json")
      .send({ title: "Rising sun" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Post Updated");
    expect(response.body.blog.title).toBe("Rising sun");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog).toHaveProperty("author");
    expect(response.body.blog.read_count).toBe(1);
  });

  it("should publish blog", async () => {
    const blog = await blogModel.create(blog);

    blogId = blog._id.toString();

    const response = await supertest(app)
      .patch("/api/blog/state/" + blogId)
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Post Updated");
    expect(response.body.blog).toHaveProperty("title");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog.state).toBe("published");
    expect(response.body.blog).toHaveProperty("author");
  });

  it("should delete a blog", async () => {
    const response = await supertest(app)
      .delete("/api/blog/" + blogId)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("true");
    expect(response.body.message).toBe("Blog deleted succesfully");
  });
});

