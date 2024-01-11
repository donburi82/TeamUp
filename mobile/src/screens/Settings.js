import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import SettingBar from '../components/SettingBar';
import {ROUTES} from '../navigator/constant';
import {useSelector} from 'react-redux';
export default function Settings() {
  const imageUri = useSelector(state => state?.userInfo?.imageUri);
  const name = useSelector(state => state?.userInfo?.name);
  return (
    <>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: imageUri}} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <SettingBar
        text="Update Basic Information"
        destination={ROUTES.BASICINFO}
      />
      <SettingBar
        text="Enter Group Preference Information"
        destination={ROUTES.PREFERENCE}
      />
      <SettingBar text="Change Password" destination={ROUTES.RESETPASSWORD} />
      <SettingBar text="Sign Out" type="signOut" />
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  image: {
    backgroundColor: 'gray',
    borderRadius: 80,
    width: 130,
    height: 130,
    marginVertical: 10,
  },
  name: {
    fontSize: 30,
    color: 'black',
  },
});
