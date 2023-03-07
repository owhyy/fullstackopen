const Notification = ({ message, isSuccess }) => {
  const className = isSuccess ? "success" : "error";
  return message === null ? null : <div className={className}>{message}</div>;
};

export default Notification;
