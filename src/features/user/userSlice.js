import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    image: "",
  },
  loading: false,
  updating: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess(state, action) {
      state.user = action.payload;
      state.loading = false;
    },
    fetchProfileFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    updateProfileStart(state) {
      state.updating = true;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.user = action.payload;
      state.updating = false;
    },
    updateProfileFailure(state, action) {
      state.error = action.payload;
      state.updating = false;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} = userSlice.actions;

export default userSlice.reducer;
