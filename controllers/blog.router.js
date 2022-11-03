const blogsRouter = require("express").Router();
const Blog = require("../models/blog.model");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blog = await Blog.find({});
    response.json(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;