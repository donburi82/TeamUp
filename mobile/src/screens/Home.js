import {View, Text} from 'react-native';
import React from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';
import {useDispatch} from 'react-redux';
import {logOut} from '../utils/reduxStore/reducer';

export default function Home() {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logOut());
  };
  return (
    <View>
      <Text>this is a empty home</Text>
      <Button onPress={logout}>
        <ButtonText>log out</ButtonText>
      </Button>
    </View>
  );
}
