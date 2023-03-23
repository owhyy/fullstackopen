const _ = require("lodash");

const dummy = (blogs) => 1;
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);
const favouriteBlog = (blogs) => _(blogs).maxBy((b) => b.likes);

const mostBlogs = (blogs) => {
  const match = _(blogs).countBy("author").entries().maxBy(_.last);
  if (match) {
    const [author, count] = match;
    return { author, blogs: count };
  }
  return null;
};

const mostLikes = (blogs) => {
  const most = _(blogs).maxBy("likes");
  if (most) {
    const { title, likes } = most;
    return { title, likes };
  }
  return null;
};

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
