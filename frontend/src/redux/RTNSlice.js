import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likeNotification: [],
};

const RTNSlice = createSlice({
  name: "realTimeNotification",
  initialState,
  reducers: {
    setLikeNotification: (state, action) => {
      const notification = action.payload;

      if (!state.likeNotification || !Array.isArray(state.likeNotification)) {
        state.likeNotification = [];
      }

      if (!notification) return;

      // For like notifications, add to array if not exists
      if (notification.type === "like") {
        const alreadyExists = state.likeNotification.some(
          (item) => 
            item.userId === notification.userId && 
            item.postId === notification.postId
        );

        if (!alreadyExists) {
          state.likeNotification.push(notification);
        }
      } 
      // For dislike notifications, remove from array
      else if (notification.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => 
            !(item.userId === notification.userId && 
              item.postId === notification.postId)
        );
      }
    },
  },
});
export const { setLikeNotification } = RTNSlice.actions;
export default RTNSlice.reducer;
