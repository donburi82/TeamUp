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
  useCheckMemberMutation,
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
  const checkMemberHook = useCheckMemberMutation();
  // const chatRoomID = route?.params?.chatRoomID;

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

  const sendMessage = async () => {
    console.log('send message', data?.leaderID);
    try {
      const chatRoom = await checkMemberHook.mutateAsync({
        leaderId: data?.leaderID,
      });
      console.log('chatRoom get back', chatRoom);
      if (chatRoom?._id) {
        navigation.navigate(ROUTES.ChatStackNavigator, {
          screen: ROUTES.CHATROOM,
          initial: false,
          params: {
            id: chatRoom?._id,
            isGroup: false,
            socket: null,
          },
        });
      }
    } catch (e) {
      console.log(e, 'message leader fail');
    }
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
