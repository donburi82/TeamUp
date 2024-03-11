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
    unwelcome: state => {
      state.userInfo = {
        ...state.userInfo,
        welcomed: false,
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

export const {
  login,
  logOut,
  update,
  welcome,
  updateImageUri,
  updateInfo,
  unwelcome,
} = globalSlice.actions;

export default globalSlice.reducer;
