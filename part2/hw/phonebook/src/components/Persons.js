const Persons = ({ persons }) => (
  <ul>
    {persons.map((p) => (
      <li key={p.name}>
        {p.name} {p.phone}
      </li>
    ))}
  </ul>
);

export default Persons;
