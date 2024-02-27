import {View, Text, PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';
import {
  useGetProfilePicQuery,
  useGetUserInfoQuery,
  useGetUserIdQuery,
} from '../utils/query/customHook';
import {useDispatch} from 'react-redux';
import InfoModal from '../components/InfoModal';
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

  const sendRequest = () => {
    fetch('https://api.contrib.ust.dev/healthz').then(
      data => {
        console.log(data);
      },
      err => {
        console.log('error', err);
      },
    );
  };
  const sendRequestPost = () => {
    request('auth/dummyPost');
  };

  useEffect(() => {
    console.log('hello testing');
    const requestAndHandleToken = async () => {
      const granted = await requestPermission();

      if (granted === true) {
        try {
          const token = await messaging().getToken();
          console.log('this is token', token, '\n');
          await updateToken(token);

          const unsubscribe = messaging().onTokenRefresh(async newToken => {
            await updateToken(newToken);
          });

          // Return the cleanup function
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

  return (
    <>
      <InfoModal />
      <Text>this is a empty home</Text>
      <Button onPress={sendRequest}>
        <ButtonText>send Request get</ButtonText>
      </Button>
      <Button onPress={sendRequestPost}>
        <ButtonText>send Request post</ButtonText>
      </Button>
    </>
  );
}
