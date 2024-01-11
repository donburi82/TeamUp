import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import SettingBar from '../components/SettingBar';
import {useGetProfilePicQuery} from '../utils/query/customHook';
import {ROUTES} from '../navigator/constant';
import BasicInfoUser from '../components/BasicInfoUser';

export default function BasicInfo() {
  const imageUri = useSelector(state => state?.userInfo?.imageUri);
  const year = useSelector(state => state?.userInfo?.year);
  const major = useSelector(state => state?.userInfo?.major).join(',');
  const name = useSelector(state => state?.userInfo?.name);
  const gender = useSelector(state => state?.userInfo?.gender);
  const isFullTime = useSelector(state => state?.userInfo?.isFullTime);
  const nationality = useSelector(state => state?.userInfo?.nationality);

  return (
    <View>
      <BasicInfoUser
        name={name}
        gender={gender === 'male' ? 'M' : 'F'}
        isFullTime={isFullTime}
        nationality={nationality}
        profilePic={imageUri}
      />
      <SettingBar
        text="Photos"
        type="basicInfo"
        // setSelectedImage={setSelectedImage}
      >
        <Image
          source={{uri: imageUri || null}}
          alt="avartar"
          style={{
            width: 30,
            height: 30,

            marginRight: 30,
            borderRadius: 100,
            backgroundColor: 'gray',
          }}
        />
      </SettingBar>
      <SettingBar
        text="Major"
        type="basicInfo"
        destination={ROUTES.CHANGEMAJOR}>
        <Text style={styles.textStyle}>{major}</Text>
      </SettingBar>
      <SettingBar
        text="Year Of Study"
        type="basicInfo"
        destination={ROUTES.CHANGEYEAR}>
        <Text style={styles.textStyle}>Year {year}</Text>
      </SettingBar>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    marginRight: 20,
    fontSize: 20,
  },
});
