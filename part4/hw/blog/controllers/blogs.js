/* eslint-disable no-underscore-dangle */
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { user } = request;
  if (!user) return response.status(401).json({ error: "unauthorized" });

  const { title, likes, author, url } = request.body;

  if (!(title && url))
    return response.status(400).json({ error: "url and title are required" });

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

  return response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { user } = request;
  if (!user) return response.status(401).json({ error: "unauthorized" });

  const blog = await Blog.findByIdAndDelete(request.params.id);
  if (!blog) return response.status(404).json({ error: "blog not found" });

  if (blog.user._id.toString() !== user._id.toString()) {
    return response
      .status(400)
      .json({ error: "you do not have the permission to delete this blog" });
  }
  await blog.delete();

  user.blogs = user.blogs.filter(
    (userBlog) => blog._id.toString() === userBlog._id.toString()
  );
  await user.save();

  return response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const blog = {
    title: body.title,
    likes: body.likes,
    author: body.author,
    url: body.url,
    user: body.user
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate("user", { username: 1, name: 1 });
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
