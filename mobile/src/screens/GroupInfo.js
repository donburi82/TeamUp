import {ScrollView, Text, View, StyleSheet, Image} from 'react-native';
import BasicInfoUser from '../components/BasicInfoUser';
import React, {useEffect, useRef} from 'react';
import SettingBar from '../components/SettingBar';
import {useRoute} from '@react-navigation/native';
import {ROUTES} from '../navigator/constant';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
import {TouchableOpacity} from 'react-native';
import {
  useGetGroupInfoQuery,
  useLeaveGroupMutation,
} from '../utils/query/customHook';
import Alert from '../components/Alert';
import {requestURL} from '../utils/query/requestForReactQuery';
import BottomSheetInviteFriend from '../components/BottomSheetInviteFriend';
import AntIcon from 'react-native-vector-icons/AntDesign';
export default function GroupInfo({navigation}) {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const route = useRoute();

  const isFromChatRoom = route?.params?.isFromChatRoom;
  const myGroup = route?.params?.myGroup;
  const groupId = route?.params?.groupId;
  const bottomSheetRef = useRef(null);
  // const chatRoomID = route?.params?.chatRoomID;
  console.log(
    'groupId in groupInfo is',
    groupId,
    myGroup,
    chatRoomID,
    route?.params,
  );
  const {data, isLoading, isError} = useGetGroupInfoQuery(groupId);
  const chatRoomID = data?.chatRoomID;
  const goChatRoom = () => {
    console.log('go chat room', data);
    navigation.navigate(ROUTES.ChatStackNavigator, {
      screen: ROUTES.CHATROOM,
      initial: false,
      params: {
        id: chatRoomID,
        title: data?.project,
        isGroup: true,
        groupId: groupId,
        socket: null,
      },
    });
  };
  const leaveGroup = useLeaveGroupMutation(navigation);

  const sendMessage = () => {
    console.log('send message', data);
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
    <>
      <ScrollView>
        <Alert
          open={alertOpen}
          setOpen={setAlertOpen}
          confirmText={'Yes, leave'}
          handleCancel={() => {
            setAlertOpen(false);
          }}
          handleConfirm={() => {
            console.log('leave group', groupId);
            leaveGroup.mutateAsync({groupId: groupId});
          }}
        />
        <View style={styles.avatarContainer}>
          {data?.members?.map((item, idx) => (
            <View
              style={{alignItems: 'center', minWidth: 90, marginTop: 20}}
              key={idx}>
              <Image
                source={{uri: requestURL.cloudImageUri + item?.profilePic}}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 30,
                }}
              />
              <Text>{item?.name}</Text>
            </View>
          ))}
          {myGroup ? (
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef?.current?.expand();
              }}
              style={{
                minWidth: 90,
                marginTop: 20,
                borderRadius: 30,
              }}>
              <AntIcon
                name="pluscircle"
                size={40}
                color="rgba(63,43,190,0.50)"
                style={{
                  textAlign: 'center',
                  lineHeight: 40,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <SettingBar text="Category" type="basicInfo" disableEdit={true}>
          <Text style={styles.textStyle}>{data?.category}</Text>
        </SettingBar>
        <SettingBar text="Project title" type="basicInfo" disableEdit={true}>
          <Text style={styles.textStyle}>{data?.project}</Text>
        </SettingBar>
        <SettingBar text="Project quota" type="basicInfo" disableEdit={true}>
          <Text style={styles.textStyle}>{data?.quota}</Text>
        </SettingBar>
        {myGroup ? (
          <>
            <DebouncedWaitingButton
              mt={40}
              mb={20}
              ml={30}
              mr={30}
              onPress={goChatRoom.bind(null)}
              text="Chat"
            />
            <DebouncedWaitingButton
              mb={20}
              ml={30}
              mr={30}
              text="Leave Group"
              style={{backgroundColor: 'red', color: 'white'}}
              onPress={() => {
                setAlertOpen(true);
              }}
            />
          </>
        ) : (
          <DebouncedWaitingButton
            mt={40}
            mb={20}
            ml={30}
            mr={30}
            onPress={sendMessage.bind(null)}
            text="Message the leader"
          />
        )}
      </ScrollView>
      <BottomSheetInviteFriend reference={bottomSheetRef} groupId={groupId} />
    </>
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
