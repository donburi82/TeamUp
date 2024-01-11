import {createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    userInfo: {
      isAuthed: false,
      updated: false,
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
      };
    },
    update: state => {
      //this is to verify if the user complete the sign up form, may change later
      state.userInfo = {
        ...state.userInfo,
        updated: true,
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
