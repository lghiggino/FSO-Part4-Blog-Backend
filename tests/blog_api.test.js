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

    blogpost = new Blog(helper.initialBlogPosts[1])
    await blogpost.save()

    blogpost = new Blog(helper.initialBlogPosts[2])
    await blogpost.save()
})

describe("GET", () => {
    it("should get all blog posts", async () => {
        const result = await api.get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/)

        expect(result.body).toHaveLength(3)
        expect(result.body[0].title).toBe("New Shoes")
    })

    it("should test if the returned object uses an id property", async () => {
        const result = await api.get("/api/blogs/")

        expect(result.body[0].id).toBeDefined
    })

    it("should get a blog by its Id", async () => {
        const blogPostsAtStart = await helper.blogPostsInDb()
        const blogPostToView = blogPostsAtStart[0]

        const resultBlogPost = await api.get(`/api/blogs/${blogPostToView.id}`)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        console.log(resultBlogPost.body)

        const processedBlogPostToView = JSON.parse(JSON.stringify(blogPostToView))

        expect(resultBlogPost.body).toEqual(processedBlogPostToView)
    })
})


describe("POST", () => {
    it("should create a new blogPost", async () => {
        const newBlogPost = new Blog({
            title: "Sunflower Samurai",
            author: "Jazzinut",
            url: "spotify.com/jazzinut/sunflowerSamurai",
            likes: 1
        })

        await newBlogPost.save()

        const getAll = await api.get("/api/blogs")
        expect(getAll.body.length).toBe(4)
        expect(getAll.body[3].title).toBe("Sunflower Samurai")
        expect(getAll.body[3].url).toBe("spotify.com/jazzinut/sunflowerSamurai")
    })

    it("should reject an empty blogPost", async () => {
        const newBlogPost = new Blog({

        })

        await api
            .post("/api/blogs")
            .send(newBlogPost)
            .expect(400)

        const response = await api.get("/api/blogs")

        expect(response.body).toHaveLength(helper.initialBlogPosts.length)
    })

    it("should receive likes: 0 if likes is missing from request", async () => {
        const newBlogPost = new Blog({
            title: "Sunflower Samurai",
            author: "Jazzinut",
            url: "spotify.com/jazzinut/sunflowerSamurai",
        })

        await api
            .post("/api/blogs")
            .send(newBlogPost)

        const getAll = await api.get("/api/blogs")
        expect(getAll.body.length).toBe(4)
        expect(getAll.body[3].likes).toBe(0)
    })

    it("should return 400 if !title && !url", async () => {
        const newBlogPost = new Blog({
            title: "",
            author: "Jazzinut",
            url: "",
            likes: 2
        })

        await api
            .post("/api/blogs")
            .send(newBlogPost)
            .expect(400)
    })


})
describe("DELETE", () => {
    it("should be able to delete one using its ID", async () => {
        const blogPostsAtStart = await helper.blogPostsInDb()
        const blogPostToRemove = blogPostsAtStart[0]

        await api.delete(`/api/blogs/${blogPostToRemove.id}`).expect(204)

        const response = await api.get("/api/blogs")

        expect(response.body).toHaveLength(helper.initialBlogPosts.length - 1)
        expect(response.body).not.toContain(blogPostToRemove.title)
    })
})

describe("UPDATE", () => {
    it.only("should update the content of a single note", async () => {
        const blogPostsAtStart = await helper.blogPostsInDb()
        let blogPostToUpdate = blogPostsAtStart[0]

        blogPostToUpdate = { ...blogPostToUpdate, likes: blogPostToUpdate.likes + 1 }

        await api.put(`/api/blogs/${blogPostToUpdate.id}`).send(blogPostToUpdate)

        const response = await api.get("/api/blogs")

        expect(response.body).toHaveLength(helper.initialBlogPosts.length)
        expect(response.body[0]).toMatchObject(
            {
                title: "New Shoes",
                author: "Blue Wednesday",
                url: "spotify.com/blueWednesday/newShoes",
                likes: 3,
                id: blogPostToUpdate.id
            })
    })
})


afterAll(() => {
    mongoose.connection.close()
})
