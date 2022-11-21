const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const {
  tenSeconds,
  initialUsers,
  nonExistingId,
  usersInDb,
} = require("../utils/list_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUserss);
});

describe("When there is a valid user in the DB", () => {
  test("returns bearer token", async () => {
    await api
      .post("/api/login", {
        username: "JDoe",
        password: "123456",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 10000);
});
