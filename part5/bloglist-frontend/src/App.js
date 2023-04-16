import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Toggleable from './components/Toggleable';
import blogService from './services/blogs';
import loginService from './services/login';

import './index.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const blogRef = useRef();

  const notifySuccess = (message) => {
    setIsSuccess(true);
    setMessage(message);
    setTimeout(() => setMessage(null), 5000);
  };

  const notifyError = (message) => {
    setIsSuccess(false);
    setMessage(message);
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1))));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const performLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password });
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser));

      setIsSuccess(true);
      notifySuccess('logged in succesfully');
    } catch (exception) {
      notifyError(exception.response.data.error);
    }
  };

  const addNewBlog = async ({ title, author, url }) => {
    blogRef.current.toggleVisibility();
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      notifySuccess(`a new blog ${newBlog.title} by ${newBlog.author} was added`);
    } catch (exception) {
      notifyError(exception.response.data.error);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);

    notifySuccess('logged out succesfully');
  };

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 });
      setBlogs(blogs.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog)));
      notifySuccess('post liked');
    } catch (exception) {
      notifyError(exception.response.data.error);
    }
  };

  const deleteBlog = async (blog) => {
    if (window.confirm(`are you sure you want to delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        notifySuccess('blog deleted successfully');
      } catch (exception) {
        notifyError(exception.response.data.error);
      }
    }
  };

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      logged in as {user.name}
      <button onClick={logout}>logout</button>
      <br />
      <br />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          currentUser={user}
          blog={blog}
          performLike={likeBlog}
          performDelete={deleteBlog}
        />
      ))}
      <Toggleable buttonLabel='add a new blog' ref={blogRef}>
        <NewBlogForm addNewBlog={addNewBlog} />
      </Toggleable>
    </div>
  );

  return (
    <div>
      <Notification isSuccess={isSuccess} message={message} />

      {user ? blogForm() : <LoginForm performLogin={performLogin} />}
    </div>
  );
}

export default App;
