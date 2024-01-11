import axios from 'axios';
import {store} from '../reduxStore';
import {err} from 'react-native-svg/lib/typescript/xml';
import {showErrorToast} from '../showToast';
const BASE_URL = 'http://10.0.2.2:3000/';

const axiosServices = axios.create({
  baseURL: BASE_URL,
  method: 'post',
  timeout: 4000,
});

const requestURL = {
  sendVerificationEmail: 'auth/verification',
  verifyCode: 'auth/verify',
  register: 'auth/register',
  login: 'auth/login',
  updateInfo: 'userBasicInfo/updateInfo',
  profilePic: 'userBasicInfo/profilePic',
  updatePassword: 'userBasicInfo/updatePassword',
  getInfo: 'userBasicInfo/getInfo',
};

async function request(url, datum, options) {
  const global = store.getState();

  const {token} = global.userInfo;
  // console.log('sending request', url, datum);
  try {
    const res = await axiosServices({
      url,
      // data: stringify ? JSON.stringify(datum) : datum,
      data: JSON.stringify(datum),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data',
      },

      ...options,
    });
    console.log('status code is', res.status);
    if (!res.status.toString().startsWith('2')) {
      console.log('状态码不对啊哥', res.status);
      throw new Error(`${res.data.msg} (${res.status})`);
    }
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // 如果有服务器返回的错误消息，就把它作为错误对象的消息
      const serverMessage =
        error.response.data.msg || 'Server responded with an error';
      throw new Error(serverMessage);
    } else {
      // 如果没有 response，抛出通用错误
      showErrorToast();
      throw new Error('Request failed');
    }
  }
}

export {requestURL, request, BASE_URL};
