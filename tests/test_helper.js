const Blog = require("../models/blogModel")

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

const blogPostsInDb = async () => {
    const blogPosts = await Blog.find({})
    return blogPosts.map(blog => blog.toJSON())
}

module.exports = { initialBlogPosts, blogPostsInDb }