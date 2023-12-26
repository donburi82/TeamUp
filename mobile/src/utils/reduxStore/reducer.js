import {createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    userInfo: {
      isAuthed: false,
      updated: false,
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
      state.userInfo = {
        ...state.userInfo,
        updated: true,
      };
    },
  },
});

export const {login, logOut, update} = globalSlice.actions;

export default globalSlice.reducer;
