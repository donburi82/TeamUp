import {createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    userInfo: {
      isAuthed: false,

      welcomed: false,
    },
  },

  reducers: {
    login: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
        isAuthed: true,
      };
    },
    logOut: state => {
      state.userInfo = {
        ...state.userInfo,
        isAuthed: false,

        welcomed: false,
      };
    },

    updateInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    welcome: state => {
      state.userInfo = {
        ...state.userInfo,
        welcomed: true,
      };
    },
    updateImageUri: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        imageUri: action.payload.imageUri,
      };
    },
  },
});

export const {login, logOut, update, welcome, updateImageUri, updateInfo} =
  globalSlice.actions;

export default globalSlice.reducer;
