import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import SettingBar from '../components/SettingBar';
import {ROUTES} from '../navigator/constant';
import BasicInfoUser from '../components/BasicInfoUser';
export default function BasicInfo() {
  return (
    <View>
      <BasicInfoUser
        name="River Mu"
        gender="M"
        status="Full-time"
        nationality="China"
      />
      <SettingBar text="Photos" type="basicInfo">
        <Image
          source={{uri: null}}
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
