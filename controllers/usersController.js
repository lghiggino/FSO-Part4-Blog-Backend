const bcrypt = require("bcrypt")
const Blog = require("../models/blogModel")
const usersRouter = require("express").Router()
const User = require("../models/userModel")


//FAZER O POPULATE PARA REALIZAR 4.17
usersRouter.post("/", async (request, response, next) => {
    const body = request.body

    // const blog = await Blog.findById(body.blogId)

    if (body.username.length < 3) {
        response.status(400).send({ error: "username must have at least 3 characters" })
    }
    if (body.password.length < 3) {
        response.status(400).send({ error: "password must have at least 3 characters" })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    try {
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()
        // blog.user = user.blogs.concat(savedUser._id)
        // await blog.save()
        response.json(savedUser)
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/:id", async (request, response, next) => {
    try {
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    catch (error) {
        next(error)
    }
})

// usersRouter.put("/:id", async (request, response, next) => {
//     const body = request.body
//     const id = request.params.id

//     const user = {
//         title: body.title,
//         author: body.author,
//         url: body.url,
//         likes: body.likes
//     }

//     try {
//         await User.findByIdAndUpdate(id, user, { new: true })
//         response.status(200).end()
//     }
//     catch (error) {
//         next(error)
//     }
// })


usersRouter.get("/", async (request, response, next) => {
    try {
        const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1, })
        response.json(users)
    }
    catch (error) {
        next(error)
    }
})

usersRouter.get("/:username", async (request, response, next) => {
    try {
        const user = await User.findOne({ username: request.params.username })
        if (user) {
            response.json(user)
        } else {
            response.status(404).end()
        }
    }
    catch (error) {
        next(error)
    }
})

module.exports = usersRouter