const blogsRouter = require("express").Router()
const Blog = require("../models/blogModel")


blogsRouter.get("/", async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    }
    catch (error) {
        next(error)
    }
})


blogsRouter.get("/:id", async (request, response, next) => {
    console.log("bateu aqui",request.params.id)
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    }
    catch (error) {
        next(error)
    }
})

blogsRouter.post("/", (request, response, next) => {
    const blog = new Blog(request.body)
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => {
            next(error)
        })
})

module.exports = blogsRouter