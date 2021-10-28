import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    updateProfileModal: false,
    openSidebar: false,
  },
  reducers: {
    openUpdateProfileModal: (state) => {
      state.updateProfileModal = true;
    },
    closeUpdateProfileModal: (state) => {
      state.updateProfileModal = false;
    },
    openSidebarModal: (state) => {
      state.openSidebar = true;
    },
    closeSidebarModal: (state) => {
      state.openSidebar = false;
    },
  },
});

export const {
  openUpdateProfileModal,
  closeUpdateProfileModal,
  openSidebarModal,
  closeSidebarModal,
} = modalSlice.actions;

export const selectUpdateProfileModal = (state) =>
  state.modal.updateProfileModal;

export const selectOpenSidebar = (state) => state.modal.openSidebar;

export default modalSlice.reducer;
