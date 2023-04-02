const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    logger.info(`Method: ${request.method}`);
    logger.info(`Path: ${request.path}`);
    logger.info(`Body: ${request.body}`);
    logger.info("---");
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.info(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).send({ error: "token expired" });
  }

  next(error);
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    request.user = null;
    // repeats next but we don't have to indent the if which i think looks better
    // also return to make sure we don't execute the code below
    return next();
  }

  const token = authorization.replace("Bearer ", "");
  const verifiedToken = jwt.verify(token, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  const userId = verifiedToken.id;
  if (!userId) {
    return response.status(401).json({
      error: "token invalid",
    });
  }

  const user = await User.findById(userId);
  if (!user) return response.status(404).json({ error: "user not found" });

  request.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
};
