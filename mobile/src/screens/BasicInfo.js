import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import SettingBar from '../components/SettingBar';
import {useGetProfilePicQuery} from '../utils/query/customHook';
import {ROUTES} from '../navigator/constant';
import BasicInfoUser from '../components/BasicInfoUser';

export default function BasicInfo() {
  const [imageUri, setSelectedImage] = React.useState('');
  const {data, isLoading, error} = useGetProfilePicQuery();
  useEffect(() => {
    if (data) {
      console.log('get data from backend profile', data);
      const blob = data.data;
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64data = reader.result;
        setImageSource(base64data);
      };
      reader.readAsDataURL(blob);
    }
  }, [data]);
  return (
    <View>
      <BasicInfoUser
        name="River Mu"
        gender="M"
        status="Full-time"
        nationality="China"
        profilePic={imageUri}
      />
      <SettingBar
        text="Photos"
        type="basicInfo"
        setSelectedImage={setSelectedImage}>
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
        <Text style={styles.textStyle}>Computer Science</Text>
      </SettingBar>
      <SettingBar
        text="Year Of Study"
        type="basicInfo"
        destination={ROUTES.ChANGEYEAR}>
        <Text style={styles.textStyle}>Year 3</Text>
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
