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

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const note = {
    title: body.title,
    url: body.url,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, note, {
      new: true,
    });
    response.status(201).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
