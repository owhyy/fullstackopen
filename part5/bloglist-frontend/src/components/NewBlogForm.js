const NewBlogForm = ({ handleCreate, setTitle, setAuthor, setUrl }) => (
  <div>
    <h2>create new</h2>
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

export default NewBlogForm;
