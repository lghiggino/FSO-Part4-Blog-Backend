const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { initialBlogs, blogsInDb } = require("../utils/list_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({
    username: "root",
    passwordHash,
    name: "Matti Luukkainen",
  });

  await user.save();
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("the first blog is Blog 01", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain("Blog 01");
  });
});

describe("addition of a new blog", () => {
  test.only("a valid blog can be added", async () => {
    const userCredentials = {
      username: "root",
      password: "sekret",
    };

    const loginResponse = await api.post("/api/login").send(userCredentials);
    const { token, userId } = loginResponse.body;

    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Mluukai",
      url: "www.fullstackopen.com",
      likes: 3,
      userId: `${userId}`,
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain("async/await simplifies making async calls");
  });

  test("blog without title is not added", async () => {
    const newBlog = {
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test.only("succeeds with status code 204 if id is valid", async () => {
    test.only("a valid blog can be added", async () => {
      const userCredentials = {
        username: "root",
        password: "sekret",
      };
  
      const loginResponse = await api.post("/api/login").send(userCredentials);
      const { token, userId } = loginResponse.body;

    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).set({ Authorization: `Bearer ${token}` }).expect(204);

    const blogsAtEnd = await blogsInDb();

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("update of a blog", () => {
  test("succeeds with status code 201 if id is valid", async () => {
    const userCredentials = {
      username: "root",
      password: "sekret",
    };

    const loginResponse = await api.post("/api/login").set({ Authorization: `Bearer ${token}` }).send(userCredentials);
    const { token, userId } = loginResponse.body;

    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`, { title: "updated blog title" })
      .expect(201);

    const blogsAtEnd = await blogsInDb();

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).toContain(blogToUpdate.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});