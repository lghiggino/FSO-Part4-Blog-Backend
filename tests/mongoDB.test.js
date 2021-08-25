const MONGODB_URI = require("../utils/config").MONGODB_URI
const mongoose = require("mongoose")


describe("connects with MongoDB", () => {
    beforeEach(async () => {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    })

    it.only("Records data in MongoDB", async () => {
        const noteSchema = new mongoose.Schema({
            content: String,
            date: Date,
            important: Boolean,
        })
        const Note = mongoose.model("Note", noteSchema)
        const note = new Note({
            content: "Banana 1",
            date: new Date(),
            important: true,
        })
        const res = await note.save()
        await mongoose.connection.close()

        expect(res.content).toEqual("Banana 1")
        expect(res.important).toBe(true)
    })
})
