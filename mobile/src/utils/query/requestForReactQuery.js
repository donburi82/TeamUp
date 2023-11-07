import axios from "axios";
import { store } from "../reduxStore";

const BASE_URL= "http://localhost:3000/"

const axiosServices = axios.create({
    baseURL:BASE_URL,
    method:'post'
})

const requestURL = {
    sendVerificationEmail:'auth/verification'

}

async function request(url,datum,options){
    const {global} = store.getState()
    const {token} = global.userInfo;
    console.log(global,token)
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
    
        if (res.status !== '200') {
          throw new Error(`${res.data.msg} (${res.status})`);
        }
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

export {requestURL,request}