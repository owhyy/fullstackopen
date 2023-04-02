/* eslint-disable no-console */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const helper = require("./test_helper");
const Note = require("../models/note");
const User = require("../models/user");

beforeEach(async () => {
  await Note.deleteMany({});

  const notes = helper.initialNotes.map((note) => new Note(note));
  const promises = notes.map((note) => note.save());
  await Promise.all(promises);
});

describe("when there is initially some notes saved", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  }, 100000);

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("HTML is easy");
  }, 100000);
});

describe("viewing a specific note", () => {
  test("succeeds with a valid id", async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(resultNote.body).toEqual(noteToView);
  }, 100000);
  test("fails with 404 if note doesn't exist", async () => {
    const validNonExistingId = await helper.nonExistingId();
    await api.get(`/api/notes/${validNonExistingId}`).expect(404);
  }, 100000);
  test("fails with 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api.get(`/api/notes/${invalidId}`).expect(400);
  }, 100000);
});

describe("addition of a new note", () => {
  test("succeeds with valid data", async () => {
    const newNote = {
      content: "async/await is cool",
      important: true,
    };
    await api
      .post("/api/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).toContain("async/await is cool");
  }, 100000);

  test("fails with 400 if data is invalid", async () => {
    const newNote = {
      important: true,
    };
    await api.post("/api/notes").send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  }, 100000);
});

describe("deletion of a note", () => {
  test("succeeds with 204 if id is valid", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).not.toContain(noteToDelete.content);
  }, 100000);
});

describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "John Doe",
      password: "boneappletea",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
