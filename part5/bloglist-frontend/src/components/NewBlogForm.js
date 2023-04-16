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
          type='text'
          name='Title'
          onChange={({ target }) => {
            setTitle(target.value);
          }}
        />
        <br />
        <br />
        author
        <br />
        <input
          type='text'
          name='Author'
          onChange={({ target }) => {
            setAuthor(target.value);
          }}
        />
        <br />
        <br />
        url
        <br />
        <input
          type='text'
          name='url'
          onChange={({ target }) => {
            setUrl(target.value);
          }}
        />
        <br />
        <br />
        <button type='submit'>create</button>
      </form>
    </div>
  );
}

NewBlogForm.propTypes = {
  addNewBlog: PropTypes.func.isRequired
}

export default NewBlogForm;
