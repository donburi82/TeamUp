import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import SettingBar from '../components/SettingBar';
import {useGetProfilePicQuery} from '../utils/query/customHook';
import {ROUTES} from '../navigator/constant';
import BasicInfoUser from '../components/BasicInfoUser';
import {Buffer} from 'buffer';
export default function BasicInfo() {
  const imageUri = useSelector(state => state?.userInfo?.imageUri);
  // const [imageUri, setSelectedImage] = React.useState('');
  // const {data, isLoading, error} = useGetProfilePicQuery();
  // useEffect(() => {
  //   if (data?.data?.data) {
  //     const byteArray = new Uint8Array(data.data.data);
  //     const base64String = Buffer.from(byteArray).toString('base64');
  //     const imageData = `data:${data.contentType};base64,${base64String}`;
  //     setSelectedImage(imageData);
  //   }
  // }, [data]);
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
