const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({
    username: "root",
    passwordHash,
    name: "Matti Luukkainen",
  });

  await user.save();
});

describe("When there is a valid user in the DB", () => {
  test("returns bearer token", async () => {
    const userCredentials = {
      username: "root",
      password: "sekret",
    };

    await api
      .post("/api/login")
      .send(userCredentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

  }, 10000);
});

afterAll(() => {
  mongoose.connection.close();
});
