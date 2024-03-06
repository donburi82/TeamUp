import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/core';
import {useGetMessageInfoQuery} from '../utils/query/customHook';
import {request} from '../utils/query/requestForReactQuery';
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
  const [fetchTrigger, setFetchTrigger] = useState(true);
  const flatListRef = useRef();
  const [messages, setMessages] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false); // 控制加载更多指示器的显示
  const {data: messagesData, isLoading} = useGetMessageInfoQuery(
    id,
    20,
    messages[0]?.messageId,
    {
      enabled: fetchTrigger && !allLoaded, // 初始执行查询
      // onSettled: () => setFetchTrigger(false), // 查询结束后重置触发状态

      onSuccess: data => {
        console.log('data', data);
        if (data.length === 0) {
          setAllLoaded(true);
          setFetchTrigger(false);
          return;
        } else {
          setMessages([...data, ...messages]);
          setFetchTrigger(false);
        }
      },
      onError: error => {
        setFetchTrigger(false);
        console.log(error);
      },
    },
  );

  const [messageReplyTo, setMessageReplyTo] = useState(null);

  const [calculatedPaddingHeight, setCalculatedPaddingHeight] = useState(0);

  // useEffect(() => {
  //   if (messagesData) setMessages(messagesData);
  // }, [messagesData]);
  useEffect(() => {
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

  const renderRefreshControl = () =>
    fetchTrigger ? (
      <View style={{alignItems: 'center', padding: 20}}>
        <ActivityIndicator />
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        ref={flatListRef}
        inverted
        data={[...messages].reverse()}
        renderItem={({item}) => <MessageBubble message={item} />}
        estimatedItemSize={40}
        keyExtractor={item => item.messageId.toString()}
        // onScroll={handleScroll}
        scrollEventThrottle={800}
        initialNumToRender={20}
        ListFooterComponent={renderRefreshControl}
        onEndReached={({distanceFromEnd}) => {
          console.log(allLoaded, distanceFromEnd, 'on end reached');
          if (allLoaded) return;
          setFetchTrigger(true);
          console.log('on end reached', distanceFromEnd); // 根据距离判断是否触发刷新
        }}
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
