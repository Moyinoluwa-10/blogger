const app = require("../app");
const supertest = require("supertest");
const blogModel = require("../models/blog.model");
const { connect, cleanup, disconnect } = require("./database");

describe("Blog Route", () => {
  let userID;
  let blogID;
  let blog;

  const user = {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    password: "password1",
    username: "johnn",
    country: "nigeria",
  };

  const createBlog = {
    title: "hey there",
    body: "and the rains fell",
    tags: "plants tulip sun",
    author: "John Doe",
    authorID: "63ba293c469cf513ca32ea42",
  };

  const publishedBlog = {
    title: "a nicef ocf",
    body: "and the rains fell",
    author: "John Doe",
    authorID: "63ba293c469cf513ca32ea42",
    state: "published",
    tags: "plants tulip sun",
    read_count: 0,
    reading_time: 1,
    _id: userID,
    __v: 0,
  };

  beforeAll(async () => {
    connect();

    const signupResponse = await supertest(app).post("/signup").send(user);

    const loginResponse = await supertest(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        email: user.email,
        password: user.password,
      });

    token = loginResponse.body.token;
    userID = signupResponse.body.user._id;

    blog = {
      title: "hey there",
      body: "and the rains fell",
      author: "John Doe",
      authorID: userID,
      tags: "plants tulip sun",
      reading_time: 1,
    };
  });
  afterEach(() => cleanup());
  afterAll(() => disconnect());

  it("should get a list of blogs", async () => {
    const blogPost = await blogModel.create(blog);

    const response = await supertest(app).get("/api/v1/blog/");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blogs");
  });

  it("should get a particular published blog", async () => {
    const blogPost = await blogModel.create(publishedBlog);
    blogID = blogPost._id.toString();

    const response = await supertest(app).get("/api/v1/blog/" + blogID);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("blog");
  });

  it("should get a list of user blogs", async () => {
    const blogPost = await blogModel.create(blog);

    const response = await supertest(app).get("/api/v1/blog/user" + userID);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "true");
    expect(response.body).toHaveProperty("blogs");
  });

  it("should create blog", async () => {
    const response = await supertest(app)
      .post("/api/v1/blog/")
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send(createBlog);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog created successfully");
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

  it("should update blog", async () => {
    const blogPost = await blogModel.create(blog);
    const blogID = blogPost._id.toString();

    const response = await supertest(app)
      .patch(`/api/v1/blog/${blogID}`)
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Rising Sun" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog updated successfully");
    expect(response.body.blog.title).toBe("Rising Sun");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog).toHaveProperty("author");
  });

  it("should publish blog", async () => {
    const blogPost = await blogModel.create(blog);
    blogID = blogPost._id.toString();

    const response = await supertest(app)
      .patch(`/api/v1/blog/state/${blogID}`)
      .set("Authorization", `Bearer ${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog published successfully");
    expect(response.body.blog).toHaveProperty("title");
    expect(response.body.blog).toHaveProperty("body");
    expect(response.body.blog).toHaveProperty("tags");
    expect(response.body.blog.state).toBe("published");
    expect(response.body.blog).toHaveProperty("author");
  });

  it("should delete a blog", async () => {
    const blogPost = await blogModel.create(blog);
    const blogID = blogPost._id.toString();

    const response = await supertest(app)
      .delete(`/api/v1/blog/${blogID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Blog deleted successfully");
  });
});

