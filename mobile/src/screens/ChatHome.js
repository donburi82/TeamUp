import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, FlatList} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {ChatRoom, ChatRoomUser} from '../src/models';
import {useGetChatRoomInfoQuery} from '../utils/query/customHook';
import ChatRoomItem from '../components/ChatRoomItem';
import io from 'socket.io-client';
import {store} from '../utils/reduxStore';
import {requestURL} from '../utils/query/requestForReactQuery';
export default function TabOneScreen() {
  const global = store.getState();

  const {token} = global.userInfo;
  const socket = io(requestURL.socketIo, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  const imageUri = useSelector(state => state?.userInfo?.imageUri);
  const [chatRooms, setChatRooms] = useState([]);
  const {data, isLoading} = useGetChatRoomInfoQuery();

  useEffect(() => {
    setChatRooms(data);
  }, [data]);

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({item}) => (
          <ChatRoomItem chatRoom={item} socket={socket} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
});

// chatroomdata

// {
//   chatRoomId: 0,
//   lastTS: 1705302041000,
//   isGroup: false,
//   chatmateName: 'River',
//   senderProfilePic: imageUri,
//   lastMessage: {
//     messageType: 'text',
//     messageData: 'good',
//     isAllRead: false,
//   },
// },
// {
//   chatRoomId: 1,
//   lastTS: 1705301041000,
//   isGroup: true,
//   lastMessage: {
//     messageType: 'text',
//     messageData: 'yes',
//     isAllRead: true,
//   },
// },
// {
//   chatRoomId: 10,
//   lastTS: 1705302041000,
//   isGroup: false,
//   chatmateName: 'River',
//   senderProfilePic: imageUri,
//   lastMessage: {
//     messageType: 'text',
//     messageData: 'good',
//     isAllRead: true,
//   },
// },
// {
//   chatRoomId: 11,
//   lastTS: 203301041000,
//   isGroup: true,
//   lastMessage: {
//     messageType: 'text',
//     messageData: 'yes',
//     isAllRead: true,
//   },
// },
// {
//   chatRoomId: 20,
//   lastTS: 1705302041000,
//   isGroup: false,
//   chatmateName: 'River',
//   senderProfilePic: imageUri,
//   lastMessage: {
//     messageType: 'text',
//     messageData: 'good',
//     isAllRead: false,
//   },
// },
// {
//   chatRoomId: 21,
//   lastTS: 1705301041000,
//   isGroup: true,
//   lastMessage: {
//     messageType: 'text',
//     messageData: 'yes',
//     isAllRead: true,
//   },
// },
