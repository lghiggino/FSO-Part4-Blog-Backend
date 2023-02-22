const blogsRouter = require("express").Router();
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blog = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blog);
  } catch (error) {
    next(error);
  }
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    const token = getTokenFrom(request);

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(body.userId);

    if (body.userId !== decodedToken.id) {
      return response.status(401).json({ error: "invalid token" });
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    console.log(savedBlog);

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const body = request.body;
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);

    console.log({ body, token, decodedToken });

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const blogToBeDeleted = await Blog.findById(request.params.id);
    console.log(blogToBeDeleted);

    if ((decodedToken.username !== blogToBeDeleted.author) ) {
      return response.status(401).json({ error: "invalid token" });
    }

    if (decodedToken.username === blogToBeDeleted.author) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = request.body;

    const blog = {
      title: body.title,
      url: body.url,
    };

    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    if (body.userId !== decodedToken.id) {
      return response.status(401).json({ error: "invalid token" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.status(201).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id/addlike", async (request, response, next) => {
  try {
    const oldBlog = await Blog.findById(request.params.id);

    if (!oldBlog.likes) {
      oldBlog.likes = 0;
    }

    const newWithExtraLike = { likes: oldBlog.likes + 1 };

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      newWithExtraLike,
      {
        new: true,
      }
    );
    response.status(201).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
