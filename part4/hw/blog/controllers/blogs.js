const jwt = require("jsonwebtoken");

const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const verifiedToken = jwt.verify(getTokenFrom(request), process.env.SECRET, {
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

  const { title, likes, author, url } = request.body;
  const blog = new Blog({
    title,
    likes,
    author,
    url,
    user: user._id,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const blog = {
    title: body.title,
    likes: body.likes,
    author: body.author,
    url: body.url,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
