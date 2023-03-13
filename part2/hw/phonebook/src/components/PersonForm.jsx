/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

function PersonForm({ onSubmit, nameOnChange, phoneOnChange }) {
  return <form onSubmit={onSubmit}>
    <div>
      name: <input onChange={nameOnChange} />
      <br />
      phone: <input onChange={phoneOnChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
}

PersonForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  nameOnChange: PropTypes.func.isRequired,
  phoneOnChange: PropTypes.func.isRequired,
}

export default PersonForm;
