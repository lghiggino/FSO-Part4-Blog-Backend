const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

describe("READ tests", () => {
    it("notes are returned as json", async () => {
        await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })

    it("should return one note by the id", async () => {
        const res = await api.get("/api/notes/1")
        expect(res.id).toBe(1)
    })
})


afterAll(() => {
    mongoose.connection.close()
})