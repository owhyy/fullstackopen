/* eslint-disable no-underscore-dangle */
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = new User({
    username: "root",
    passwordHash: await bcrypt.hash("toor", 10),
    name: "john",
  });
  await user.save();

  const blogs = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id.toString() })
  );
  const promises = blogs.map((blog) => blog.save());
  await Promise.all(promises);
}, 100000);

describe("when there are some blogs", () => {
  test("blogs are returned in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 100000);

  test("blogs have an 'id' field", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
    expect(blog._id).toBeUndefined();
    expect(blog.__v).toBeUndefined();
  }, 100000);
});

describe("creating a new blog", () => {
  test("succeeds when valid data", async () => {
    const newBlog = {
      title: "Some other blog",
      author: "Me",
      url: "https://me.atyou",
      likes: 50,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const finalBlogs = await helper.blogsInDb();
    expect(finalBlogs).toHaveLength(helper.initialBlogs.length + 1);

    const titles = finalBlogs.map((blog) => blog.title);
    expect(titles).toContain(newBlog.title);
  }, 100000);
  test("sets likes to 0 if not provided", async () => {
    const newBlog = {
      title: "Yet another other blog",
      author: "Me",
      url: "https://me.atyou",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const finalBlogs = await helper.blogsInDb();
    const blogCreatedRightNow = finalBlogs.find(
      (blog) => blog.title === newBlog.title
    );
    expect(blogCreatedRightNow.likes).toEqual(0);
  }, 100000);
  //   test("fails with 400 if title is missing", async () => {
  //     const titleMissing = {
  //       author: "Me",
  //       url: "https://me.atyou",
  //     };
  //
  //     await api.post("/api/blogs").send(titleMissing).expect(400);
  //   }, 100000);
  //   test("fails with 400 if url is missing", async () => {
  //     const urlMissing = {
  //       title: "Yup",
  //       author: "Me",
  //     };
  //     await api.post("/api/blogs").send(urlMissing).expect(400);
  //   }, 100000);
});

describe("deleting a blog", () => {
  test("succeeds with 204 if id exists", async () => {
    const initialBlogs = await helper.blogsInDb();
    const blogToDelete = initialBlogs[0];
    const lengthBefore = helper.initialBlogs.length;
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfterDeletion = await helper.blogsInDb();
    expect(blogsAfterDeletion.length).toEqual(lengthBefore - 1);

    const blogTitlesAfterDeletion = blogsAfterDeletion.map(
      (blog) => blog.title
    );
    expect(blogTitlesAfterDeletion).not.toContain(blogToDelete.title);
  }, 100000);
});

describe("editing a blog", () => {
  test("succeeds with 201 if id exists", async () => {
    const initialBlogs = await helper.blogsInDb();
    const blogBeforeUpdate = initialBlogs[0];
    const blogToUpdate = { ...blogBeforeUpdate, likes: 100 };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201);

    const blogsAfterUpdate = await helper.blogsInDb();
    const updatedBlog = blogsAfterUpdate.find(
      (blog) => blog.title === blogToUpdate.title
    );
    expect(updatedBlog.likes).not.toEqual(blogBeforeUpdate.likes);
    expect(updatedBlog.likes).toEqual(blogToUpdate.likes);
  }, 100000);
});

describe("creating a user", () => {
  test("succeeds with 201 if valid data", async () => {
    const userToAdd = {
      username: "someone",
      password: "foobar",
      name: "joe mama",
    };
    await api
      .post("/api/users")
      .send(userToAdd)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAfterCreate = await helper.usersInDb();
    expect(usersAfterCreate.length).toEqual(1 + 1);

    const usernames = usersAfterCreate.map((user) => user.username);
    expect(usernames).toContain(userToAdd.username);
  }, 100000);
  test("fails with 400 when username not unique", async () => {
    const nonUniqueUsernameUser = {
      username: "root",
      password: "foobar",
      name: "joe mama",
    };
    await api.post("/api/users").send(nonUniqueUsernameUser).expect(400);
  }, 100000);
  test("fails with 400 when length of username < 3", async () => {
    const usernameTooShortUser = {
      username: "xx",
      password: "foobar",
      name: "joe mama",
    };
    await api.post("/api/users").send(usernameTooShortUser).expect(400);
  }, 100000);
  test("fails with 400 when length of password < 3", async () => {
    const passwordTooShortUser = {
      username: "thisisit",
      password: "xx",
      name: "joe mama",
    };
    await api.post("/api/users").send(passwordTooShortUser).expect(400);
  }, 100000);
});
