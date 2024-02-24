import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/core';
import {useGetMessageInfoQuery} from '../utils/query/customHook';
import Message from '../components/Message';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import MessageInput from '../components/MessageInput';
const screenHeight = Dimensions.get('window').height;
// Assume 50px height for header/footer/input field, adjust based on your UI
const otherComponentsHeight = 50;

export default function ChatRoomScreen() {
  const route = useRoute();
  const id = route.params?.id;
  const socket = route.params?.socket;

  const chatMateName = route.params?.title;
  const flatListRef = useRef();
  console.log('chatroom id is', id, 're-rendering');
  const {data: messagesData, isLoading} = useGetMessageInfoQuery(id, 20);

  const [messages, setMessages] = useState([]);
  const [messageReplyTo, setMessageReplyTo] = useState(null);

  const [calculatedPaddingHeight, setCalculatedPaddingHeight] = useState(0);

  useEffect(() => {
    if (messagesData) setMessages(messagesData);
  }, [messagesData]);
  useEffect(() => {
    console.log('executed');
    const totalMessagesHeight = messages ? messages?.length * 90 : 0; // Estimate this value
    const availableSpace =
      screenHeight - totalMessagesHeight - otherComponentsHeight;

    const newCalculatedPaddingHeight = availableSpace > 0 ? availableSpace : 0;
    // Only update state if the value has actually changed
    if (calculatedPaddingHeight !== newCalculatedPaddingHeight) {
      setCalculatedPaddingHeight(newCalculatedPaddingHeight);
    }
  }, [messages]);

  useEffect(() => {
    socket.on('updateMessage', data => {
      setMessages(messages => [...messages, data]);
    });
    socket.emit('joinChatRoom', {
      chatRoomId: id,
    });

    return () => {
      socket.emit('leaveChatRoom', {
        chatRoomId: id,
      });
      socket.off('updateMessage');
    };
  }, [id, socket]);
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        ref={flatListRef}
        inverted
        data={[...messages].reverse()}
        renderItem={({item}) => <MessageBubble message={item} />}
        estimatedItemSize={40}
        initialNumToRender={20}
        ListHeaderComponent={() => (
          <View
            style={{
              height: calculatedPaddingHeight,
            }}></View>
        )}
      />
      <MessageInput
        id={id} //this is chatroom id
        messageReplyTo={messageReplyTo}
        removeMessageReplyTo={() => setMessageReplyTo(null)}
        socket={socket}
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
