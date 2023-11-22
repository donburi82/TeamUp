import {View, Text} from 'react-native';
import React from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';
import {useDispatch} from 'react-redux';
import {logOut} from '../utils/reduxStore/reducer';

export default function InfoFilling() {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logOut());
  };
  return (
    <View>
      <Text>
        this page requires users to fill information, this page indicates that
        you haven't complete filling your basic information
      </Text>
      <Button onPress={logout}>
        <ButtonText>log out</ButtonText>
      </Button>
    </View>
  );
}
