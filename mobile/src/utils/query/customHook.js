
import { request,requestURL } from "./requestForReactQuery";
import { useMutation } from "react-query";
export const useSendVerificationEmailMutation = () => {

    const url = requestURL.sendVerificationEmail;
    const reqFunc = async (email) => {
      console.log("I am sending request",email)
      const res = await request(url, { email });
      return res;
    };
    return useMutation(reqFunc, {});
  };