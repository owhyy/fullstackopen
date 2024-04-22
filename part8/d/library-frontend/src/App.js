import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { MY_PROFILE } from "./constants";
import { useQuery } from "@apollo/client";

const App = () => {
    const [page, setPage] = useState("books");
    const [token, setToken] = useState(null);

  const isLogged = token !== null;
    
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
      </div>

	  <Books show={page === "books"} />
	  <Authors show={page === "authors"} />
	  <Login show={page === "login"} />
	  <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
