const listHelper = require("../utils/list_helper");

const someBlog = {
  _id: "5a422aa71b54a676234d17f8",
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  likes: 5,
  __v: 0,
};

const someOtherBlog = {
  _id: "5a422aa71b54a676234d17f9",
  title: "Learn AI From Scratch",
  author: "some Anon",
  url: "https://www.learnaifromscratch.com/",
  likes: 20,
  __v: 0,
};

const yetAnotherBlog = {
  _id: "5a422aa71b54a676234d17f0",
  title: "Engineers need to write",
  author: "Ryan Peterman",
  url: "https://www.developing.dev/p/why-engineers-need-to-write",
  likes: 15,
  __v: 0,
};

test("dummy returns 1", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([someBlog]);
    expect(result).toBe(5);
  });

  test("of empty list is 0", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes([someBlog, someBlog]);
    expect(result).toBe(10);
  });
});

describe("favourite blog", () => {
  test("of empty list is that", () => {
    const result = listHelper.favouriteBlog([someBlog]);
    expect(result).toEqual(someBlog);
  });

  test("of list with multiple elements is correct", () => {
    const result = listHelper.favouriteBlog([someBlog, someOtherBlog]);
    expect(result).toEqual(someOtherBlog);
  });

  test("of list with multiple elements with same likes is one of them", () => {
    const result = listHelper.favouriteBlog([someBlog, someBlog]);
    expect(result).toEqual(someBlog);
  });
});

describe("author with most blogs", () => {
  test("when no blogs is null", () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(null);
  });
  test("when one blog is that", () => {
    const result = listHelper.mostBlogs([someBlog]);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", blogs: 1 });
  });
  test("when multiple same blogs is correct", () => {
    const result = listHelper.mostBlogs([someBlog, someBlog]);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", blogs: 2 });
  });
  test("when same number of blogs is either", () => {
    const result = listHelper.mostBlogs([
      someBlog,
      someBlog,
      someOtherBlog,
      someOtherBlog,
    ]);
    expect(result).not.toBeNull();
  });
});

describe("blog with most likes", () => {
  test("when no blog is none", () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBeNull();
  });

  test("when single blog is that", () => {
    const result = listHelper.mostLikes([someBlog]);
    expect(result).toEqual({ title: someBlog.title, likes: someBlog.likes });
  });

  test("when multiple blogs is correct", () => {
    const result = listHelper.mostLikes([
      someBlog,
      someOtherBlog,
      yetAnotherBlog,
    ]);
    expect(result).toEqual({
      title: someOtherBlog.title,
      likes: someOtherBlog.likes,
    });
  });
});
