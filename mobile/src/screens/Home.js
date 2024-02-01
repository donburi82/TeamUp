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

export default function Home() {
  const dispatch = useDispatch();

  const {data, isLoading, error} = useGetProfilePicQuery();

  const _ = useGetUserInfoQuery();

  const logout = () => {
    dispatch(logOut());
  };
  return (
    <>
      <InfoModal />
      <Text>this is a empty home</Text>
      <Button onPress={logout}>
        <ButtonText>log out</ButtonText>
      </Button>
    </>
  );
}
