import {createSlice} from '@reduxjs/toolkit';
import {combineReducers} from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    userInfo: {
      isAuthed: false,
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
      };
    },
  },
});

export const {login, logOut} = globalSlice.actions;

export default globalSlice.reducer;
