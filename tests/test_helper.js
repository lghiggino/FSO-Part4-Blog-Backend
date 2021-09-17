const Blog = require("../models/blogModel")
const User = require("../models/userModel")

const initialBlogPosts = [
    {
        title: "New Shoes",
        author: "Blue Wednesday",
        url: "spotify.com/blueWednesday/newShoes",
        likes: 2
    },
    {
        title: "Awakening",
        author: "J'San",
        url: "spotify.com/jsan/awakening",
        likes: 10
    },
    {
        title: "Sayonara",
        author: "Blue Wednesday",
        url: "spotify.com/blueWednesday/Sayonara",
        likes: 1
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: "SayonaraNot", likes: 1 })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogPostsInDb = async () => {
    const blogPosts = await Blog.find({})
    return blogPosts.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialBlogPosts, blogPostsInDb, nonExistingId, usersInDb }