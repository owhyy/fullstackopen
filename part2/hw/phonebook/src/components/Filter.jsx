/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

function Filter({ onChange }) {
  return <div>
    filter those with: <input onChange={onChange} />
  </div>
}

Filter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default Filter;
