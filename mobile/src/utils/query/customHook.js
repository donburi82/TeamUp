import {request, requestURL} from './requestForReactQuery';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import {login, logOut} from '../reduxStore/reducer';
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
  const dispatch = useDispatch();
  const url = requestURL.register;
  const reqFunc = async ({email, password}) => {
    console.log('I am sending request register', email, password);
    const res = await request(url, {email, password});
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: ({token}) => {
      dispatch(login({token}));
    },
  });
};
export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const url = requestURL.login;
  const reqFunc = async ({email, password}) => {
    console.log('I am sending request login', email, password);
    const res = await request(url, {email, password});
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: ({token}) => {
      dispatch(login({token}));
    },
  });
};
export const useUpdateInfoMutation = () => {
  const dispatch = useDispatch();
  const url = requestURL.updateInfo;
  const reqFunc = async ({
    name,
    isFullTime,
    gender,
    nationality,
    major,
    year,
  }) => {
    console.log('I am sending request login', email, password);
    const res = await request(
      url,
      {
        name,
        isFullTime,
        gender,
        nationality,
        major,
        year,
      },
      {method: 'patch'},
    );
    return res;
  };
  return useMutation(reqFunc);
};

export const useUpdateImageMutation = () => {
  const dispatch = useDispatch();
  const url = requestURL.profilePic;
  const reqFunc = async file => {
    console.log('I am sending request updateImage');
    const res = await request(url, {file});
    return res;
  };
  return useMutation(reqFunc);
};
