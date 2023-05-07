import { useState } from 'react';
import PropTypes from 'prop-types';

function NewBlogForm({ addNewBlog }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreate = (event) => {
    event.preventDefault();
    addNewBlog({ title, author, url });
  };

  return (
    <div>
      <h2>create new blog</h2>

      <form onSubmit={handleCreate}>
        title
        <br />
          <input
          id='title'
          type='text'
          name='Title'
          placeholder='enter a title'
          onChange={({ target }) => {
            setTitle(target.value);
          }}
        />
        <br />
        <br />
        author
        <br />
          <input
          id='author'
          type='text'
          name='Author'
          placeholder='enter the author'
          onChange={({ target }) => {
            setAuthor(target.value);
          }}
        />
        <br />
        <br />
        url
        <br />
          <input
          id='url'
          type='text'
          name='url'
          placeholder='enter the url'
          onChange={({ target }) => {
            setUrl(target.value);
          }}
        />
        <br />
        <br />
        <button type='submit' id='create-blog'>create</button>
      </form>
    </div>
  );
}

NewBlogForm.propTypes = {
  addNewBlog: PropTypes.func.isRequired
}

export default NewBlogForm;
