import {ScrollView, Text, StyleSheet} from 'react-native';
import BasicInfoUser from '../components/BasicInfoUser';
import React, {useEffect} from 'react';
import SettingBar from '../components/SettingBar';
import {useRoute} from '@react-navigation/native';
import {ROUTES} from '../navigator/constant';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
export default function OtherUserInfo({navigation}) {
  const route = useRoute();
  const isFromChatRoom = route?.params?.isFromChatRoom;
  // useEffect(() => {
  //   const backHandler = navigation.addListener('beforeRemove', e => {
  //     e.preventDefault(); // 阻止默认行为
  //     if (isFromChatRoom) {
  //       // 如果是从聊天室页面进入的，返回聊天室
  //       navigation.goBack();
  //     } else {
  //       // 如果是从用户列表等其他页面进入的，导航到聊天室页面
  //       // 假设聊天室ID是chatRoomId
  //       console.log(e);
  //       // navigation.navigate(ROUTES.CHATHOME, {
  //       //   screen: ROUTES.CHATROOM,
  //       //   params: {chatRoomId: null},
  //       // });
  //     }
  //   });
  //   return () => backHandler.remove();
  // }, []);
  const sendMessage = () => {
    // 假设有一个函数来判断用户是从哪个页面来的

    if (isFromChatRoom) {
      // 如果是从聊天室页面进入的，返回聊天室
      navigation.goBack();
    } else {
      // 如果是从用户列表等其他页面进入的，导航到聊天室页面
      // 假设聊天室ID是chatRoomId
      // navigation.goBack();
      navigation.navigate(ROUTES.CHATHOME, {
        screen: ROUTES.CHATROOM,
        params: {chatRoomId: null},
      });
    }
  };
  return (
    <ScrollView>
      <BasicInfoUser
        name={'test'}
        gender={'M'}
        isFullTime={false}
        nationality={'Zimbabwei'}
        profilePic={null}
      />

      <SettingBar text="Major" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>
          {'Computer Engineeringgggggggggggggggggggggggggggggggggggggggggg'}
        </Text>
      </SettingBar>
      <SettingBar text="Year Of Study" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{'Year 5'}</Text>
      </SettingBar>
      <SettingBar text="Lookng for" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{'COMP3111'}</Text>
      </SettingBar>

      <DebouncedWaitingButton
        mt={80}
        mb={20}
        ml={30}
        mr={30}
        onPress={sendMessage.bind(null)}
        text="Message"
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
});
