import { voteAnecdote } from "../reducers/anecdoteReducer";
import {
  setNotification
} from "../reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => {
    if (!state.filter) {
      return state.anecdotes;
    }
    return state.anecdotes.filter((a) =>
      a.content.toLowerCase().includes(state.filter.toLowerCase())
    );
  });

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(setNotification(`voted on '${anecdote.content}'`), 5);
  };
  return (
    <>
      {anecdotes
        .slice()
        .sort((a, b) => (a.votes < b.votes ? 1 : -1))
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </>
  );
};

export default AnecdoteList;
