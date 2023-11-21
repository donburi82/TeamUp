import {createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    userinfo: {
      isAuthed: false,
    },
  },

  reducers: {
    login: (state, action) => {
      state.userinfo = {
        ...state.userinfo,
        ...action.payload,
        isAuthed: true,
      };
    },
    logOut: state => {
      state.userinfo = {
        isAuthed: false,
      };
    },
  },
});

export const {login, logOut} = globalSlice.actions;

export default globalSlice.reducer;
