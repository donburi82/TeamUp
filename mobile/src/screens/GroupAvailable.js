import {ScrollView, Text, View, StyleSheet, Image} from 'react-native';
import BasicInfoUser from '../components/BasicInfoUser';
import React, {useEffect} from 'react';
import SettingBar from '../components/SettingBar';
import {useRoute} from '@react-navigation/native';
import {ROUTES} from '../navigator/constant';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
export default function GroupAvailable({navigation}) {
  const route = useRoute();
  const isFromChatRoom = route?.params?.isFromChatRoom;

  const sendMessage = () => {
    // 假设有一个函数来判断用户是从哪个页面来的
    // if (isFromChatRoom) {
    //   // 如果是从聊天室页面进入的，返回聊天室
    //   navigation.goBack();
    // } else {
    //   // 如果是从用户列表等其他页面进入的，导航到聊天室页面
    //   // 假设聊天室ID是chatRoomId
    //   // navigation.goBack();
    //   navigation.navigate(ROUTES.CHATHOME, {
    //     screen: ROUTES.CHATROOM,
    //     params: {chatRoomId: null},
    //   });
    // }
  };
  return (
    <ScrollView>
      <View style={styles.avatarContainer}>
        {[1, 2, 3, 4, 5, 6, 7].map(() => (
          <View style={{alignItems: 'center', minWidth: 90, marginTop: 20}}>
            <Image
              source={require('../utils/demo.png')}
              style={{
                height: 40,
                width: 40,
                borderRadius: 30,
              }}
            />
            <Text>name</Text>
          </View>
        ))}
      </View>
      <SettingBar text="Category" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{'Course Project'}</Text>
      </SettingBar>
      <SettingBar text="Project title" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{'COMP 3111'}</Text>
      </SettingBar>
      <SettingBar
        text="Project description"
        type="basicInfo"
        disableEdit={true}>
        <Text style={styles.textStyle}>{'XXXXXX'}</Text>
      </SettingBar>

      <DebouncedWaitingButton
        mt={40}
        mb={20}
        ml={30}
        mr={30}
        onPress={sendMessage.bind(null)}
        text="Message the leader"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    marginRight: 20,
    fontSize: 20,
  },
  button: {
    width: 80,
    height: 40,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 20,
    paddingBottom: 20,
  },
});
