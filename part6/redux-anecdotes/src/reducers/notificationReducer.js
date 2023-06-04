import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    changeNotification(state, action) {
      state = action.payload;
      return state;
    },
    removeNotification(state, action) {
      return null;
    },
  },
});

export const { changeNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (content, secondsToLive) => {
  return async (dispatch) => {
    dispatch(changeNotification(content));
    setTimeout(() => dispatch(removeNotification()), 5000);
  };
};

export default notificationSlice.reducer;
