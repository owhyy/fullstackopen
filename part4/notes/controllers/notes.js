/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404);
  }
});

notesRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

notesRouter.put("/:id", async (request, response) => {
  const body = { request };
  const note = { content: { body }, important: { body } };

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
  });
  response.status(201).json(updatedNote);
});

notesRouter.post("/", async (request, response) => {
  const { body } = request;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) return response.status(404).json({ error: "user not found" });

  if (!body.content)
    return response.status(400).json({
      error: "content missing",
    });

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });
  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);
});

module.exports = notesRouter;
