const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

notesRouter.get("/:id", (request, response, next) =>
  Note.findById(request.params.id)
    .then((note) => (note ? response.json(note) : response.status(404).end()))
    .catch((error) => next(error))
);

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => response.result(204).end())
    .catch((error) => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const note = { content: body.content, important: body.important };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => response.json(updatedNote))
    .catch((error) => next(error));
});

notesRouter.post("/", (request, response) => {
  const body = request.body;
  if (!body.content)
    return response.status(400).json({
      error: "content missing",
    });

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note.save().then((result) => {
    response.json(note);
  });
});

module.exports = notesRouter;
