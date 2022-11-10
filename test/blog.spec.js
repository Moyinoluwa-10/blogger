const supertest = require("supertest");
const app = require("../app");
const blogModel = require("../models/blogModel");
const { connect } = require("./database");

describe("Blog Route", () => {
  let conn;
  let userID;

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
    authorID: "636960d60c23ab26bd72b219",
    author: "John Doe",
  };

  const publishedBlog = {
    title: "Like father like son",
    description: "Train up your children",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus architecto enim cum tempore autem at, porro ad et nisi vel delectus aliquid!.",
    tags: "train father son",
    authorID: "636960d60c23ab26bd72b219",
    author: "John Doe",
    state: "published",
  };

  beforeAll(async () => {
    conn = await connect();

    const signupResponse = await supertest(app).post("/api/signup").send(user);

    const loginResponse = await supertest(app)
      .post("/api/login")
      .set("content-type", "application/json")
      .send({
        email: user.email,
        password: user.password,
      });

    token = loginResponse.body.token;
    userID = signupResponse.body.user._id;
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
    expect(response.body.status).toBe(true);
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

  it("should get a list of blogs", async () => {
    const blogPost = await blogModel.create(blog);

    const response = await supertest(app).get("/api/blog/");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blogs");
  });

  it("should get a particular published blog", async () => {
    const blogPost = await blogModel.create(publishedBlog);

    blogID = blogPost._id.toString();

    const response = await supertest(app).get("/api/blog/" + blogID);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blog");
  });

  it("should get a list of user blogs", async () => {
    const blogPost = await blogModel.create(blog);

    const response = await supertest(app).get("/api/blog/user" + userID);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "true");
    expect(response.body).toHaveProperty("blogs");
  });

  it("should update blog", async () => {
    const blogPost = await blogModel.create(blog);

    const blogID = blogPost._id.toString();

    const response = await supertest(app)
      .patch("/api/blog/" + blogID)
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json")
      .send({ title: "Rising Sun" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.blog.title).toBe("Rising Sun");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog).toHaveProperty("author");
  });

  it("should publish blog", async () => {
    const blogPost = await blogModel.create(blog);

    const blogID = blogPost._id.toString();

    const response = await supertest(app)
      .patch("/api/blog/state/" + blogID)
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.blog).toHaveProperty("title");
    expect(response.body.blog).toHaveProperty("description");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog.state).toBe("published");
    expect(response.body.blog).toHaveProperty("author");
  });

  it("should delete a blog", async () => {
    const blogPost = await blogModel.create(blog);

    const blogID = blogPost._id.toString();

    const response = await supertest(app)
      .delete("/api/blog/" + blogID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog deleted successfully");
  });
});

