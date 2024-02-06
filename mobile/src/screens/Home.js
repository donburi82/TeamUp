import {View, Text} from 'react-native';
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

import {request} from '../utils/query/requestForReactQuery';

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
