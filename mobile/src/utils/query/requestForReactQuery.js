import axios from "axios";
import { store } from "../reduxStore";

const BASE_URL= "http://129.105.10.105:3000/"

const axiosServices = axios.create({
    baseURL:BASE_URL,
    method:'post'
})

const requestURL = {
    sendVerificationEmail:'auth/verification'

}

async function request(url,datum,options){
    const global = store.getState()
    console.log(store.getState())
    const {token} = global.userinfo;
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
    
        if (res.status !== 200) {
          console.log("状态码不对啊哥",res.status)
          throw new Error(`${res.data.msg} (${res.status})`);
        }
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

export {requestURL,request}