const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 3,
        required: true
    },
    author: {
        type: String,
        minLength: 5,
        required: true
    },
    url: {
        type: String,
        minLength: 10,
        required: true
    },
    likes: Number
})

const Blog = mongoose.model("Blog", blogSchema)

module.exports = Blog