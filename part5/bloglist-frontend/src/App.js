import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Login from './components/Login';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const loggedUser = await loginService.login({ username, password });
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser));
      setUsername('');
      setPassword('');

      setIsSuccess(true);
      notifySuccess('logged in succesfully');
    } catch (exception) {
      notifyError('wrong username or password');
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    console.log('creating a new blog with', title, author, url);
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      notifySuccess(`a new blog ${newBlog.title} by ${newBlog.author} was added`);
    } catch (exception) {
      notifySuccess(`adding ${title} failed`);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);

    setIsSuccess(true);
    setMessage('logged out succesfully');
  };

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      logged in as {user.name}
      <button onClick={logout}>logout</button>
      <br />
      <br />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <NewBlogForm
        handleCreate={handleCreate}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
      ></NewBlogForm>
    </div>
  );

  return (
    <div>
      <Notification isSuccess={isSuccess} message={message}></Notification>
      {user ? blogForm() : Login({ handleLogin, setUsername, setPassword })}
    </div>
  );
};

export default App;
