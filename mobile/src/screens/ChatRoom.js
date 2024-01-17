import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/core';

import Message from '../components/Message';
import MessageInput from '../components/MessageInput';

export default function ChatRoomScreen() {
  const [messages, setMessages] = useState([
    {
      messageId: 1,
      senderId: 22222,
      profilePic: null,
      senderName: 'Samson',
      sentDate: '2024-01-17T02:03:56.820Z',
      messageType: 'text',
      messageData: 'hello world test message 4',
      isAllRead: false,
    },
    {
      messageId: 2,
      senderId: 22222,
      profilePic: null,
      senderName: 'Samson',
      sentDate: '2024-01-17T02:03:56.820Z',
      messageType: 'text',
      messageData: 'hello world test message 5',
      isAllRead: false,
    },
    {
      messageId: 3,
      senderId: 22222,
      profilePic: null,
      senderName: 'Samson',
      sentDate: '2024-01-17T02:03:56.820Z',
      messageType: 'text',
      messageData: 'hello world test message 6',
      isAllRead: false,
    },
  ]);
  const [messageReplyTo, setMessageReplyTo] = useState(null);

  const route = useRoute();
  const id = route.params?.id;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={messages}
        renderItem={({item}) => <Message message={item} />}
        // inverted
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
