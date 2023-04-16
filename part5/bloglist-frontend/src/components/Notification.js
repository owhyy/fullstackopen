import PropTypes from 'prop-types';

function Notification({ isSuccess, message }) {
  const className = isSuccess ? 'success' : 'error';
  return message === null ? null : <div className={className}>{message}</div>;
}

Notification.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default Notification;
