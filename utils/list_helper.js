const Blog = require("../models/blog.model");
const User = require("../models/user.model");

const tenSeconds = 10000;

const initialBlogs = [
  {
    title: "Blog 01",
    author: "Leonardo N Ghiggino",
    url: "http://localhost:3001/teste/teste",
    likes: 1,
    user: "637df2d4f7b0347e590712f9"
  },
  {
    title: "Blog 02",
    author: "Leonardo N Ghiggino",
    url: "http://localhost:3001/teste/teste",
    likes: 2,
    user: "637df2d4f7b0347e590712f9"
  },
];

const initialUsers = [
  {
    blogs: [],
    username: "root",
    name: "Superuser",
    passwordHash:
      "$2b$10$EeGSueIzcawIfu.IKKrAo.eff0cH.8boC3MGJwR.wlPAj9dzHcmEe",
    __v: 0,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "Leonardo Ghiggino",
    url: "http://www.google.com",
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  console.log(blogs)
  return blogs.map((blog) => blog.toJSON());
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.reduce(reducer, 0);
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};
module.exports = {
  totalLikes,
  tenSeconds,
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  initialUsers,
};
