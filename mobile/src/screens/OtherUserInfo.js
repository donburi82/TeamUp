import {ScrollView, Text, StyleSheet} from 'react-native';
import BasicInfoUser from '../components/BasicInfoUser';
import React, {useEffect} from 'react';
import SettingBar from '../components/SettingBar';
import {useRoute} from '@react-navigation/native';
import {ROUTES} from '../navigator/constant';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
import {useGetUserInfoQuery} from '../utils/query/customHook';
import {HeaderBackButton} from '@react-navigation/elements'; // 这里大坑啊，文档里面说从/@react-navigation/stack里面引入，但是实际上是从/@react-navigation/elements引入

export default function OtherUserInfo({navigation}) {
  const route = useRoute();
  const isFromChatRoom = route?.params?.isFromChatRoom;
  const userId = route?.params?.userId;
  console.log('userid is ', userId);
  const {data} = useGetUserInfoQuery(userId);
  let isFullTime = data?.userInfo?.isFullTime || false;
  let name = data?.userInfo?.name || 'N/A';
  let major = data?.userInfo?.major || ['N/A'];
  let year = data?.userInfo?.year || 'N/A';
  let lookingFor = data?.userInfo?.lookingFor || 'N/A';
  let gender = data?.userInfo?.gender || 'M';
  let profilePic = data?.userInfo?.profilePic || null;
  console.log('user info is ', data);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            // 这里实现你的自定义返回逻辑
            if (isFromChatRoom) {
              // 如果是从聊天室页面进入的，执行特定的返回逻辑
              console.log('Returning from Chat Room');
              navigation.goBack();
            } else {
              // 如果是从其他页面进入的，导航到特定的页面
              console.log('Not from chat room, navigate accordingly');
              navigation.goBack();
              navigation.navigate(ROUTES.HOME, {
                params: {chatRoomId: null},
              });
            }
          }}
        />
      ),
    });
  }, [navigation, isFromChatRoom]);
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
        name={name}
        gender={gender}
        isFullTime={isFullTime}
        nationality={'Zimbabwei'}
        profilePic={profilePic}
      />

      <SettingBar text="Major" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{major?.join(',')}</Text>
      </SettingBar>
      <SettingBar text="Year Of Study" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{`Year ${year}`}</Text>
      </SettingBar>
      <SettingBar text="Lookng for" type="basicInfo" disableEdit={true}>
        <Text style={styles.textStyle}>{lookingFor}</Text>
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
