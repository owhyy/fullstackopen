/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

function Persons({ persons, deletePerson }) {
  return (
    <ul>
      {persons.map((p) => (
        <li key={p.id}>
          {p.name} {p.phone}
          <button type="button" onClick={() => deletePerson(p)}>delete</button>
        </li>
      ))}
    </ul>
  );
}

Persons.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string, PropTypes.number, PropTypes.string)).isRequired,
  deletePerson: PropTypes.func.isRequired,
}

export default Persons;
