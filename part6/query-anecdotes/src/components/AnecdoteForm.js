import { useMutation, useQueryClient } from "react-query";
import { useNotificationDispatch } from "../NotificationContext";
import { createAnecdote } from "../requests";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatchNotification = useNotificationDispatch();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes");
      queryClient.setQueryData("anecdotes", anecdotes.concat(newAnecdote));
      dispatchNotification({ type: "NEW" });
      setTimeout(() => dispatchNotification({ type: "CLEAR" }), 5000);
    },
    onError: (error) => {
      dispatchNotification({ type: "ERROR", message: error.message });
      setTimeout(() => dispatchNotification({ type: "CLEAR" }), 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
