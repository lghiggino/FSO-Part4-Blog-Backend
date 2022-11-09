const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog.model");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Blog 01",
    author: "Leonardo Ghiggino",
    url: "www.google.com",
    likes: 1,
  },
  {
    title: "Blog 02",
    author: "Leonardo Ghiggino",
    url: "www.google.com",
    likes: 2,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 10000);

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(2);
});

test("the first blog is Blog 01", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].title).toBe("Blog 01");
});

afterAll(() => {
  mongoose.connection.close();
});
