const bcrypt = require("bcrypt")
const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const User = require("../models/userModel")


beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", passwordHash })
    await user.save()

    const secondUser = new User({
        "notes": [],
        "username": "artoHellas",
        "name": "Arto Hellas",
        "password": passwordHash
    })

    await secondUser.save()
})

describe("GET - USERS", () => {
    it("should retrieve every user at the DB", async () => {
        const response = await api.get("/api/users")
        console.log(response.body)
        expect(response.body).toHaveLength(2)
    })

    it("should get a user by its username", async () => {
        //create a new user
        const passwordHash = await bcrypt.hash("lghiggino", 10)
        const newUser = new User({
            "notes": [],
            "username": "lghiggino",
            "name": "Leonardo Ghiggino",
            "password": passwordHash
        })

        await newUser.save()
        //find the new user
        const response = await api.get("/api/users/lghiggino")
        console.log("THIS RESPONSE.BODY", response.body)
        expect(response.body.username).toBe("lghiggino")
        expect(response.body.name).toBe("Leonardo Ghiggino")
    })

})

describe("POST - USERS", () => {
    it("should create with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "mluukkai",
            name: "Mattu Luukkainen",
            password: "salainen"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/)


        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    it("should return with error if username is not unique", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("`username` to be unique")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    it("should return with error if username is too short", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "ab",
            name: "failedUser",
            password: "validPassword",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("username must have at least 3 characters")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    it("should return with error if password is too short", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "validUsername",
            name: "failedUser",
            password: "ab",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("password must have at least 3 characters")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })


})


afterAll(() => {
    mongoose.connection.close()
})