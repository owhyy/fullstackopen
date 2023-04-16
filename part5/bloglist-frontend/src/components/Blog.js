import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ currentUser, blog, performLike, performDelete }) => {
  const [displayFull, setDisplayFull] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const hideWhenShowFull = { ...blogStyle, display: displayFull ? 'none' : '' };
  const displayWhenShowFull = { ...blogStyle, display: displayFull ? '' : 'none' };

  const showWhenCreatedByCurrentUser = { display: currentUser.id === blog.user.id ? '' : 'none' };

  const toggleDisplayFull = () => {
    setDisplayFull(!displayFull);
  };

  const handleLike = () => {
    performLike(blog);
  };

  const handleDelete = () => {
    performDelete(blog);
  };

  // TODO: this is stupid but i cant think of a better way right now
  return (
    <div>
      <div style={hideWhenShowFull}>
        {blog.title} by {blog.author} <button onClick={toggleDisplayFull}>display</button>
      </div>
      <div style={displayWhenShowFull}>
        {blog.title} by {blog.author} <button onClick={toggleDisplayFull}>hide</button>
        <br />
        <a href={blog.url}>{blog.url}</a>
        <br />
        likes {blog.likes} <button onClick={handleLike}> like </button>
        <br />
        {blog.user.name}
        <br />
        <button style={showWhenCreatedByCurrentUser} onClick={handleDelete}>
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  currentUser: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  performLike: PropTypes.func.isRequired,
  performDelete: PropTypes.func.isRequired,
};

export default Blog;
