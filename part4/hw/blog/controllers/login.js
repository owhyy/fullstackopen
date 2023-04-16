const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginRouter = require("express").Router();
const User = require("../models/user");

// eslint-disable-next-line consistent-return
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect)
    return response.status(401).json({
      error: "invalid username or password",
    });

  const userForToken = {
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id });
});

module.exports = loginRouter;
