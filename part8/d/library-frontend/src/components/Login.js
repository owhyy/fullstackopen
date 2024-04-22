import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../constants";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [performLogin] = useMutation(LOGIN);

    if (!props.show) {
	return null;
    }
    
  const submit = async (event) => {
    event.preventDefault();

    performLogin({ variables: { username, password } });

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
