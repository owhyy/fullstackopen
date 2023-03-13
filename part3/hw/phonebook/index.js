const express = require("express");

const app = express();
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("tiny+data", (tokens, req, res) =>
  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    JSON.stringify(req.body),
  ].join(" ")
);

app.use(express.static("build")).use(morgan("tiny+data")).use(express.json());

app.get("/api/persons", (request, response) =>
  Person.find({}).then((persons) => response.json(persons))
);

app.get("/api/info", (request, response) => {
  const persons = Person.find({}).then((all) => all);
  const personsInfo = `<p>Phonebook has info for ${persons.length} people</p>`;
  const timeInfo = `<p>${new Date()}</p>`;
  response.send(personsInfo + timeInfo);
});

app.get("/api/persons/:id", (request, response, next) =>
  Person.findById(request.params.id)
    .then((person) =>
      person ? response.json(person) : response.status(404).end()
    )
    .catch((error) => next(error))
);

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { body } = request;

  let isError = false;
  let errorMsg = null;
  if (!body.name) {
    errorMsg = "Name missing";
    isError = true;
  }

  if (!body.phone) {
    errorMsg = "Phone missing";
    isError = true;
  }

  if (body.phone) {
    Person.find({ name: body.name }).then((person) => {
      console.log(person);
      errorMsg = "name must be unqiue";
      isError = true;
    });
  }

  if (isError) return response.status(400).json({ error: errorMsg });

  const newPerson = new Person({ name: body.name, phone: body.phone });
  return newPerson
    .save()
    .then(() => response.json(newPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { body } = request;
  const person = { name: body.name, phone: body.phone };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  let message = null;
  const status = 400;

  switch (error.name) {
    case "CastError":
      message = "malformed id";
      break;

    case "ValidationError":
      message = error.message;
      break;

    default:
      next(error);
      break;
  }

  return response.status(status).send({ error: message });
};

app.use(errorHandler);
