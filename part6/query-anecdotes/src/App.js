import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAnecdotes, updateAnecdote } from "./requests";

const App = () => {
  const queryClient = useQueryClient();
  const updatedAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes");
      queryClient.setQueriesData(
        "anecdotes",
        anecdotes.map((a) =>
          a.id !== updatedAnecdote.id ? a : updatedAnecdote
        )
      );
    },
  });

  const handleVote = (anecdote) => {
    console.log(anecdote);
    updatedAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const result = useQuery("anecdotes", getAnecdotes);
  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const anecdotes = result.data;
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
