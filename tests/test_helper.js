const blog = require("../models/blogModel")

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
    }
]

module.exports = {initialBlogPosts}