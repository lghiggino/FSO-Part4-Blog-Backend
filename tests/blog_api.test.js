const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")

const Blog = require("../models/blogModel")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogpost = new Blog(helper.initialBlogPosts[0])
    await blogpost.save()

    blogpost = new Blog(helper.initialBlogPosts[0])
    await blogpost.save()
})

describe("GET", () => {
    it("should get all blog posts", async () => {
        const result = await api.get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/)
        console.log(result.body)
    })
})
describe("POST", () => { })
describe("DELETE", () => { })


afterAll(() => {
    mongoose.connection.close()
})
