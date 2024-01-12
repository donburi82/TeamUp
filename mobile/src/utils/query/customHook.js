import {request, requestURL} from './requestForReactQuery';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {login, logOut, updateImageUri, updateInfo} from '../reduxStore/reducer';
import {useQueryClient} from 'react-query';
import {Buffer} from 'buffer';
import {showUpdateToast} from '../showToast';
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
  const queryClient = useQueryClient();
  const reqFunc = async ({
    name,
    isFullTime,
    gender,
    nationality,
    major,
    year,
  }) => {
    console.log(major);
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
  return useMutation(reqFunc, {
    onSuccess: data => {
      queryClient.invalidateQueries([requestURL.getInfo]);
    },
  });
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
      // console.log('get back data is ', data);
      if (data?.userInfo) {
        dispatch(updateInfo(data?.userInfo));
      }
    },
  });
};
export const useGetCourseStudyQuery = userId => {
  const dispatch = useDispatch();
  const url = requestURL.preference;
  const reqFunc = async () => {
    const res = await request(
      url,
      {userId, groupType: 'CourseStudy'},
      {method: 'get'},
      true,
    );
    return res?.data;
  };
  return useQuery(['CourseStudy'], reqFunc, {
    onSuccess: data => {
      // console.log(data);
    },
  });
};
export const useGetCourseProjectQuery = userId => {
  const dispatch = useDispatch();
  const url = requestURL.preference;
  const reqFunc = async () => {
    const res = await request(
      url,
      {userId, groupType: 'CourseProject'},
      {method: 'get'},
      true,
    );
    return res?.data;
  };
  return useQuery(['CourseProject'], reqFunc, {
    onSuccess: data => {
      // console.log(data);
    },
  });
};
export const useGetExtracurricularQuery = userId => {
  const dispatch = useDispatch();
  const url = requestURL.preference;
  const reqFunc = async () => {
    const res = await request(
      url,
      {userId, groupType: 'Extracurricular'},
      {method: 'get'},
      true,
    );
    return res?.data;
  };
  return useQuery(['Extracurricular'], reqFunc, {
    onSuccess: data => {
      // console.log('Extracurricular', data);
    },
  });
};

export const useDeleteCourseStudyMutation = () => {
  const url = requestURL.preference;
  const queryClient = useQueryClient();
  const userId = useSelector(state => state?.userInfo?.userId);
  const reqFunc = async preferenceId => {
    const res = await request(
      url,
      {userId, preferenceId},
      {method: 'delete'},
      true,
    );
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries(['CourseStudy']);
      showUpdateToast();
    },
  });
};
export const useDeleteCourseProjectMutation = () => {
  const url = requestURL.preference;
  const queryClient = useQueryClient();
  const userId = useSelector(state => state?.userInfo?.userId);
  const reqFunc = async preferenceId => {
    console.log('call function');
    const res = await request(
      url,
      {userId, preferenceId},
      {method: 'delete'},
      true,
    );
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries(['CourseProject']);
      showUpdateToast();
    },
  });
};
export const useDeleteExtracurricularMutation = () => {
  const url = requestURL.preference;
  const queryClient = useQueryClient();
  const userId = useSelector(state => state?.userInfo?.userId);
  const reqFunc = async preferenceId => {
    const res = await request(
      url,
      {userId, preferenceId},
      {method: 'delete'},
      true,
    );
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries(['Extracurricular']);
      showUpdateToast();
    },
  });
};
export const useAddCourseStudyMutation = () => {
  const url = requestURL.coursestudy;
  const queryClient = useQueryClient();
  const userId = useSelector(state => state?.userInfo?.userId);
  const reqFunc = async (courseCode, targetGrade, preferredLanguage) => {
    const res = await request(url, {
      userId,
      courseCode,
      targetGrade,
      preferredLanguage,
    });
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries(['CourseStudy']);
      showUpdateToast();
    },
  });
};
export const useAddCourseProjectMutation = () => {
  const url = requestURL.courseproject;
  const queryClient = useQueryClient();
  const userId = useSelector(state => state?.userInfo?.userId);
  const reqFunc = async (
    courseCode,
    projectInterest,
    skillset,
    targetGrade,
    experience,
  ) => {
    const res = await request(url, {
      userId,
      courseCode,
      projectInterest,
      skillset,
      targetGrade,
      experience,
    });
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries(['CourseProject']);
      showUpdateToast();
    },
  });
};
export const useAddExtracurricularMutation = () => {
  const url = requestURL.extracurricular;
  const queryClient = useQueryClient();
  const userId = useSelector(state => state?.userInfo?.userId);
  const reqFunc = async (
    projectInterest,
    skillset,
    experience,
    preferredLanguage,
  ) => {
    const res = await request(url, {
      userId,
      projectInterest,
      skillset,
      experience,
      preferredLanguage,
    });
    return res;
  };
  return useMutation(reqFunc, {
    onSuccess: () => {
      queryClient.invalidateQueries(['Extracurricular']);
      showUpdateToast();
    },
  });
};
