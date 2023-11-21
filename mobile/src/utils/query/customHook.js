import {request, requestURL} from './requestForReactQuery';
import {useMutation} from 'react-query';
export const useSendVerificationEmailMutation = () => {
  const url = requestURL.sendVerificationEmail;
  const reqFunc = async email => {
    console.log('I am sending request', email);
    const res = await request(url, {email});
    return res;
  };
  return useMutation(reqFunc, {});
};
export const useVerifyCodeMutation = () => {
  const url = requestURL.verifyCode;
  const reqFunc = async ({verificationCode, email}) => {
    console.log(
      'I am sending request of auth/verify ',
      email,
      verificationCode,
    );
    const res = await request(url, {email, verificationCode});
    return res;
  };
  return useMutation(reqFunc, {});
};

export const useRegisterEmailMutation = () => {
  const url = requestURL.register;
  const reqFunc = async ({email, password}) => {
    console.log('I am sending request register', email, password);
    const res = await request(url, {email, password});
    return res;
  };
  return useMutation(reqFunc, {});
};
