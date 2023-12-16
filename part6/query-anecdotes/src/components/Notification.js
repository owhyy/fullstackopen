import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const content = useNotificationValue();
  console.log(content);
  if (!content) return null;

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return <div style={style}>{content}</div>;
};

export default Notification;
