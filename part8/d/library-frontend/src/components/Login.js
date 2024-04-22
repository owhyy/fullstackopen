import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../constants";

const Login = ({ show, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
    const token = result.data.login.value;
    localStorage.setItem("library-user-token", token);
    setToken(token);

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
