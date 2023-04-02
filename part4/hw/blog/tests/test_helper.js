const Blog = require("../models/blog")

const initialBlogs = [
  {
    title: "Lorem ipsum",
    author: "Foo Bar",
    url: "https://me.atyou",
    likes: 15,
  },
  {
    title: "This is a real blog",
    author: "Real Man",
    url: "https://realurl.realcom",
    likes: 10,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs, blogsInDb };
