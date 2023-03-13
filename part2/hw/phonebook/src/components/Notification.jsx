/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

function Notification({ message, isSuccess }) {
  const className = isSuccess ? "success" : "error";
  return message === null ? null : <div className={className}>{message}</div>;
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  isSuccess: PropTypes.bool.isRequired
}

export default Notification;
