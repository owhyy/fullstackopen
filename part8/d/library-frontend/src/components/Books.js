import { useQuery, executeQuery } from "@apollo/client";
import { ALL_BOOKS } from "../constants";
import { useState, useEffect } from "react";

const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("");

  const {loading, data} = useQuery(ALL_BOOKS);

  useEffect(() => {
    if (data)
      setBooks(data.allBooks);
  }, [data]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!props.show) {
    return null;
  }
  const genres = [...new Set(books.map((b) => b.genres).flat(1))];

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.map((g) => (
        <button value={g} key={g} onClick={({ target }) => setBooks(books.filter((b) => b.genres.includes(target.value)))}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
