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
    console.log("bateu aqui", request.body)
    if (request.body.title === undefined && request.body.url === undefined) {
        response.status(400).end()
        return
    }
    //checking if body has likes, if not create likes: 0
    let blog = new Blog({
        "title": request.body.title,
        "author": request.body.author,
        "url": request.body.url,
        "likes": request.body.likes || 0,
    })
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