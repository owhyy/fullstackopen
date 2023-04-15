const bcrypt = require("bcrypt");

const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body;

  if (!password || !username) {
    return response
      .status(400)
      .json({ error: "password and username cannot be empty" });
  }
  if (username.length <= 3 || password.length <= 3)
    return response
      .status(400)
      .json({ error: "password and username length must be > 3" });

  if (await User.findOne({ username }))
    return response.status(400).json({ error: "user with this already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, username, passwordHash });
  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    likes: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
