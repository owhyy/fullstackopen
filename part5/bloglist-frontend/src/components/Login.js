const Login = ({ handleLogin, setUsername, setPassword }) => (
  <div>
    <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
        <br />
        <input type='text' name='Username' onChange={({ target }) => setUsername(target.value)} />
      </div>
      <br />
      <div>
        password
        <br />
        <input
          type='password'
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <br />
      <button type='submit'>login</button>
    </form>
  </div>
);

export default Login;
