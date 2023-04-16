import { useState } from 'react';
import PropTypes from 'prop-types';

function LoginForm({ performLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    performLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <br />
          <input
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
            type='text'
            value={username}
          />
        </div>

        <br />

        <div>
          password
          <br />
          <input
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            type='password'
            value={password}
          />
        </div>

        <br />

        <button type='submit'>login</button>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  performLogin: PropTypes.func.isRequired,
};

export default LoginForm;
