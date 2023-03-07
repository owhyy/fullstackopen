const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map((p) => (
        <li key={p.id}>
          {p.name} {p.phone}
          <button onClick={() => deletePerson(p)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
