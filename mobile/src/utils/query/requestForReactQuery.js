import axios from 'axios';
import {store} from '../reduxStore';

const BASE_URL = 'http://10.0.2.2:3000/';

const axiosServices = axios.create({
  baseURL: BASE_URL,
  method: 'post',
  timeout: 3000,
});

const requestURL = {
  sendVerificationEmail: 'auth/verification',
  verifyCode: 'auth/verify',
  register: 'auth/register',
  login: 'auth/login',
};

async function request(url, datum, options) {
  const global = store.getState();

  const {token} = global.userInfo;

  try {
    const res = await axiosServices({
      url,
      data: JSON.stringify(datum),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
      throw new Error('Request failed');
    }
  }
}

export {requestURL, request};
