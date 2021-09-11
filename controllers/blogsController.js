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
    const body = request.body

    if (!body.title && !body.url) {
        response.status(400).end()
        return
    }

    try {
        let blog = new Blog(body)
        console.log("body", body)
        console.log("blog", blog)
        const savedBlog = blog.save()
        response.status(201).json(savedBlog)
    }
    catch (error) {
        next(error)
    }
})

blogsRouter.delete("/:id", async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    catch (error) {
        next(error)
    }
})

blogsRouter.put("/:id", async (request, response, next) => {
    const body = request.body
    const id = request.params.id

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        await Blog.findByIdAndUpdate(id, blog, { new: true })
        response.status(200).end()
    }
    catch (error) {
        next(error)
    }
})

module.exports = blogsRouter