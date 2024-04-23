import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../constants";

const AuthorsBirthYearForm = () => {
  const result = useQuery(ALL_AUTHORS);
  const [id, setId] = useState("");
  const [year, setYear] = useState("");

  const [updateBirthYear] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (event) => {
    event.preventDefault();

    const yearAsInt = parseInt(year);
    console.log(id, year);
    updateBirthYear({ variables: { id, born: yearAsInt } });

    setId("");
    setYear("");
  };

  if (result.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select onChange={({ target }) => setId(target.value)}>
            {result.data.allAuthors.map((author) => (
              <option key={author.name} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          born
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default AuthorsBirthYearForm;
