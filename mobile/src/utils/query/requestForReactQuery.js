import axios from 'axios';
import {store} from '../reduxStore';
import {err} from 'react-native-svg/lib/typescript/xml';
import {showErrorToast, showExpireToast} from '../showToast';
import {Platform} from 'react-native';
import {logOut} from '../reduxStore/reducer';
// iOS-specific code
// const BASE_URL =
//   Platform.OS === 'ios'
//     ? 'http://192.168.10.102:3000/'
//     : 'http://10.0.2.2:3000/';

const BASE_URL =
  Platform.OS === 'ios' ? 'http://localhost:3000/' : 'http://10.0.2.2:3000/';
// const BASE_URL =
//   Platform.OS === 'ios'
//     ? 'http://localhost:3000/'
//     : 'http://38.54.36.244:3000/';

// Android-specific code

const axiosServices = axios.create({
  baseURL: BASE_URL,
  method: 'post',
  timeout: 4000,
});

const requestURL = {
  userscourseproject: 'users/courseproject',
  userscoursestudy: 'users/coursestudy',
  usersextracurricular: 'users/extracurricular',
  sendVerificationEmail: 'auth/verification',
  verifyCode: 'auth/verify',
  register: 'auth/register',
  login: 'auth/login',
  password: 'auth/password',
  updateInfo: 'userBasicInfo/updateInfo',
  profilePic: 'userBasicInfo/profilePic',
  updatePassword: 'userBasicInfo/password',
  getUserId: 'userBasicInfo/getUserId',
  getInfo: 'userBasicInfo/getInfo',
  updateRegToken: 'userBasicInfo/registerationToken',
  preference: 'preference',
  courseproject: 'preference/courseproject',
  coursestudy: 'preference/coursestudy',
  extracurricular: 'preference/extracurricular',
  chatroomInfo: 'chat/chatRoom',
  getMessages: 'chat/message',
  getGroups: 'groups',
};

async function request(url, datum, options, isGetRequest) {
  const global = store.getState();

  const {token} = global.userInfo;

  try {
    let axiosOptions = {
      url,

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      ...options,
    };
    if (isGetRequest) axiosOptions.params = datum;
    else {
      axiosOptions.data = JSON.stringify(datum);
    }
    // if (isGetRequest) console.log(axiosOptions);
    const res = await axiosServices(axiosOptions);
    // console.log(res.data, `get from ${url}`);
    if (!res.status.toString().startsWith('2')) {
      console.log('状态码不对啊哥', res.status);
      throw new Error(`${res.data.msg} (${res.status})`);
    }
    return res.data;
  } catch (error) {
    // console.log(error.response, 'eroor new');
    if (error?.response?.status === 401) {
      store.dispatch(logOut());
      showExpireToast();
    }
    if (error.response && error.response.data) {
      // 如果有服务器返回的错误消息，就把它作为错误对象的消息

      const serverMessage =
        error.response.data.msg || 'Server responded with an error';
      throw new Error(serverMessage);
    } else {
      // 如果没有 response，抛出通用错误
      showErrorToast();
      console.log(error);
      throw new Error(`Request failed! ${url} ${error}`);
    }
  }
}

export {requestURL, request, BASE_URL};
