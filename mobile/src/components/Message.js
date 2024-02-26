import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
// import { DataStore } from "@aws-amplify/datastore";
// import { User } from "../../src/models";
// import { Auth, Storage } from "aws-amplify";
// import { S3Image } from "aws-amplify-react-native";
import {useWindowDimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useActionSheet } from "@expo/react-native-action-sheet";
// import AudioPlayer from "../AudioPlayer";
// import {Message as MessageModel} from '../../src/models';
// import MessageReply from '../MessageReply';

const blue = '#3777f0';
const grey = 'lightgrey';

const Message = ({message}) => {
  const {setAsMessageReply, messageData, senderId} = message;
  const userId = useSelector(state => state?.userInfo?.userId);

  const [soundURI, setSoundURI] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const {width} = useWindowDimensions();
  //   const { showActionSheetWithOptions } = useActionSheet();

  return (
    <Pressable
      onLongPress={null}
      style={[
        styles.container,
        userId === senderId ? styles.rightContainer : styles.leftContainer,
        // {width: soundURI ? '75%' : 'auto'},
      ]}>
      {/* {repliedTo && <MessageReply message={repliedTo} />} */}
      <View style={styles.row}>
        {/* {message.image && (
          <View style={{ marginBottom: message.content ? 10 : 0 }}>
            <S3Image
              imgKey={message.image}
              style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
              resizeMode="contain"
            />
          </View>
        )}
        {soundURI && <AudioPlayer soundURI={soundURI} />} */}
        <Text style={{color: userId === senderId ? 'black' : 'white'}}>
          {isDeleted ? 'message deleted' : messageData}
        </Text>
        {/* {isMe && !!message.status && message.status !== 'SENT' && (
          <Ionicons
            name={
              message.status === 'DELIVERED' ? 'checkmark' : 'checkmark-done'
            }
            size={16}
            color="gray"
            style={{marginHorizontal: 5}}
          />
        )} */}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageReply: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: 'auto',
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: 'auto',
    marginRight: 10,
    alignItems: 'flex-end',
  },
});

export default Message;
