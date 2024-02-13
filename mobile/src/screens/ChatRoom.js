import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/core';
import {useGetMessageInfoQuery} from '../utils/query/customHook';
import Message from '../components/Message';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import MessageInput from '../components/MessageInput';

export default function ChatRoomScreen() {
  const route = useRoute();
  const id = route.params?.id;
  const chatMateName = route.params?.title;
  const flatListRef = useRef();
  const {data: messagesData, isLoading} = useGetMessageInfoQuery(id, 20);

  const [messages, setMessages] = useState(null);
  const [messageReplyTo, setMessageReplyTo] = useState(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);
  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        ref={flatListRef}
        style={
          {
            // backgroundColor: 'red',
          }
        }
        onContentSizeChange={() => {
          flatListRef.current.scrollToEnd({animated: false});
        }}
        data={messages}
        renderItem={({item}) => <MessageBubble message={item} />}
      />
      <MessageInput
        id={id} //this is chatroom id
        messageReplyTo={messageReplyTo}
        removeMessageReplyTo={() => setMessageReplyTo(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
});

// [
//   {
//     messageId: 1,
//     senderId: 22222,
//     profilePic: null,
//     senderName: 'Samson',
//     sentDate: '2024-01-17T02:03:56.820Z',
//     messageType: 'text',
//     messageData: 'hello world test message 4',
//     isAllRead: false,
//   },
//   {
//     messageId: 2,
//     senderId: 22222,
//     profilePic: null,
//     senderName: 'Samson',
//     sentDate: '2024-01-17T02:03:56.820Z',
//     messageType: 'text',
//     messageData: 'hello world test message 5',
//     isAllRead: false,
//   },
//   {
//     messageId: 3,
//     senderId: 22222,
//     profilePic: null,
//     senderName: 'Samson',
//     sentDate: '2024-01-17T02:03:56.820Z',
//     messageType: 'text',
//     messageData: 'hello world test message 6',
//     isAllRead: false,
//   },
// ]
