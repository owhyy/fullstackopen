import { createContext, useReducer, useContext } from "react";
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

const notificationReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "NEW":
      return "FOO";
    case "VOTE":
      return "BAR";
    case "CLEAR":
      return null;
    case "ERROR":
      return action.message ?? "Something went wrong";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    "",
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export default NotificationContext;
