import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  console.log(token)
  const isLogged = token !== null;

  const performLogin = (token) => {
    setToken(token);
    setPage("authors");
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();

    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button hidden={isLogged} onClick={() => setPage("login")}>
          login
        </button>
        <button hidden={!isLogged} onClick={() => setPage("add")}>
          add book
        </button>
        <button hidden={!isLogged} onClick={logout}>
          logout
        </button>
      </div>

      <Books show={page === "books"} />
      <Authors show={page === "authors"} />
      <Login show={page === "login"} setToken={performLogin} />
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
