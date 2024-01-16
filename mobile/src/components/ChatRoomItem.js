import React, {useState, useEffect} from 'react';
import {
  Text,
  Image,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {ROUTES} from '../navigator/constant';
import moment from 'moment';

export default function ChatRoomItem({chatRoom}) {
  // const [users, setUsers] = useState<User[]>([]); // all users in this chatroom
  const [user, setUser] = useState(null); // the display user
  const [lastMessage, setLastMessage] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    // const fetchUsers = async () => {
    //   const fetchedUsers = (await DataStore.query(ChatRoomUser))
    //     .filter((chatRoomUser) => chatRoomUser.chatroom.id === chatRoom.id)
    //     .map((chatRoomUser) => chatRoomUser.user);
    //   // setUsers(fetchedUsers);
    //   const authUser = await Auth.currentAuthenticatedUser();
    //   setUser(
    //     fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
    //   );

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    // };
    // fetchUsers();
  }, []);

  useEffect(() => {
    // if (!chatRoom.chatRoomLastMessageId) {
    //   return;
    // }
    // DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
    //   setLastMessage
    // );
    setLastMessage(chatRoom?.lastMessage);
  }, []);

  const onPress = () => {
    navigation.navigate(ROUTES.CHATROOM, {id: chatRoom.chatRoomId});
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const time = moment(chatRoom?.lastTS).from(moment());

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {chatRoom.senderProfilePic ? (
        <Image
          source={{uri: chatRoom.senderProfilePic || user?.imageUri}}
          style={styles.image}
        />
      ) : (
        <View style={styles.image}></View>
      )}

      {!lastMessage.isAllRead && <View style={styles.badgeContainer} />}

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {chatRoom?.chatmateName || user?.name}
          </Text>
          <Text style={styles.text}>{time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {lastMessage?.messageData}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  badgeContainer: {
    backgroundColor: 'red',
    width: 15,
    height: 15,
    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 45,
    top: 10,
  },

  rightContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 3,
  },
  text: {
    color: 'grey',
  },
});
