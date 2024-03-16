import {View, Text, ScrollView, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';

import {
  useGetProfilePicQuery,
  useGetUserInfoQuery,
  useGetUserIdQuery,
} from '../utils/query/customHook';
import {useDispatch} from 'react-redux';
import InfoModal from '../components/InfoModal';
import UserBarComponent from '../components/UserBarComponent';
import {logOut} from '../utils/reduxStore/reducer';
import {store} from '../utils/reduxStore';
import {
  request,
  requestURL,
  BASE_URL,
} from '../utils/query/requestForReactQuery';
import messaging from '@react-native-firebase/messaging';

// function for requesting notification permission andriod
const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can post notifications');
      return true;
    } else {
      console.log('Permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const updateToken = async regToken => {
  try {
    const global = store.getState();
    const {token} = global.userInfo;

    const url = BASE_URL + requestURL.updateRegToken;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        registrationToken: regToken,
      }),
    });

    console.log('this is response', response, '\n');

    if (response.ok) {
      console.log('Token updated successfully');
    } else {
      console.log('Failed to update token');
    }
  } catch (error) {
    console.error('Failed to update token: ', error);
  }
};

export default function Home() {
  const {data, isLoading, error} = useGetProfilePicQuery();

  const _ = useGetUserInfoQuery();
  const [usersList, setUsersList] = useState([]);
  const splitArray = arr => {
    const splitArray = [];
    for (let i = 0; i < arr?.length; i += 10) {
      splitArray.push(arr.slice(i, i + 10));
    }
    return splitArray;
  };
  const sendRequest = async () => {
    const dataArray = await request('/riverTestUsers', {}, {method: 'get'});
    let splitDataArray = splitArray(dataArray?.data);
    console.log(splitDataArray.length);
    // while (splitedArray.length) {
    //   const processBatch = () => {
    //     console.log(splitedArray.length);
    //     if (splitedArray.length) {
    //       let thisBatch = splitedArray.shift();
    //       setUsersList(prevUsersList => [...prevUsersList, ...thisBatch]);
    //       requestAnimationFrame(processBatch);
    //     }
    //   };
    // }
    // processBatch();
    // setUsersList(dataArray?.data || []);  // 1000条数据出现卡顿

    let timer; // Declare timer outside so it can be cleared on cleanup
    const processBatch = () => {
      if (splitDataArray.length) {
        let thisBatch = splitDataArray.shift();
        setUsersList(prevUsersList => [...prevUsersList, ...thisBatch]);
        timer = setTimeout(processBatch, 100); // Adjust timeout as needed
      }
    };

    processBatch(); // Start processing batches

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    const requestAndHandleToken = async () => {
      const granted = await requestPermission();

      if (granted === true) {
        try {
          const token = await messaging().getToken();
          await updateToken(token);

          const unsubscribe = messaging().onTokenRefresh(async newToken => {
            await updateToken(newToken);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error('Failed to get token or update token: ', error);
        }
      } else {
        console.log('Permission denied');
      }
    };

    requestAndHandleToken();
  }, []);


  useEffect(() => {
    sendRequest();
  }, []);

  return (
    <ScrollView
      // style={{alignItems: 'center'}}
      contentContainerStyle={{alignItems: 'center'}}>
      <InfoModal />

      {usersList.map((item, index) => (
        <UserBarComponent usersList={item} key={index} />
      ))}
    </ScrollView>
  );
}
