import {request, requestURL} from './requestForReactQuery';
import {useMutation, useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {login, logOut, updateImageUri, updateInfo} from '../reduxStore/reducer';
import {useQueryClient} from 'react-query';
import {Buffer} from 'buffer';
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
export const useUpdatePasswordMutation = () => {
  const dispatch = useDispatch();
  const url = requestURL.updatePassword;
  const reqFunc = async ({oldPassword, newPassword}) => {
    console.log('I am sending request updateInfo');
    const res = await request(
      url,
      {
        pre: oldPassword,
        cur: newPassword,
      },
      {method: 'patch'},
    );
    return res;
  };
  return useMutation(reqFunc);
};
export const useGetProfilePicQuery = () => {
  const dispatch = useDispatch();
  const url = requestURL.profilePic;
  const reqFunc = async () => {
    const res = await request(url, null, {method: 'get'});
    return res;
  };
  return useQuery([url], reqFunc, {
    onSuccess: data => {
      if (data?.data?.data) {
        const byteArray = new Uint8Array(data.data.data);
        const base64String = Buffer.from(byteArray).toString('base64');
        const imageData = `data:${data.contentType};base64,${base64String}`;

        dispatch(updateImageUri({imageUri: imageData}));
      }
    },
  });
};

export const useUpdateProfileMutation = () => {
  const url = requestURL.profilePic;
  const queryClient = useQueryClient();
  const reqFunc = async (image, type) => {
    console.log('I am sending request useUpdateProfileMutation', image, type);
    const res = await request(url, {image, type}, {method: 'patch'});
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries([requestURL.profilePic]);
    },
  });
};

export const useGetUserInfoQuery = () => {
  const dispatch = useDispatch();
  const url = requestURL.getInfo;
  const reqFunc = async () => {
    const res = await request(url, null, {method: 'get'});
    return res;
  };
  return useQuery([url], reqFunc, {
    onSuccess: data => {
      console.log('get back data is ', data);
      if (data?.data) {
      }
    },
  });
};
