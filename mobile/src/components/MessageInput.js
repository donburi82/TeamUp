import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSendMessageMutation} from '../utils/query/customHook';
// import * as ImagePicker from "expo-image-picker";
// import { v4 as uuidv4 } from "uuid";
// import { Audio, AVPlaybackStatus } from "expo-av";
// import AudioPlayer from "../AudioPlayer";
// import MessageComponent from "../Message";
// import { ChatRoomUser } from "../../src/models";

const MessageInput = ({id}) => {
  const [message, setMessage] = useState('');

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(null);
  const [soundURI, setSoundURI] = useState(null);

  const navigation = useNavigation();
  const addMessage = useSendMessageMutation(id);
  const onPress = () => {
    if (image) {
      sendImage();
    } else if (soundURI) {
      sendAudio();
    } else if (message) {
      sendMessage();
    } else {
      console.log('no message');
    }
  };

  const sendAudio = () => {};
  const sendImage = () => {};
  const resetFields = () => {
    setMessage('');

    setImage(null);
    setProgress(0);
    setSoundURI(null);
  };

  const sendMessage = async () => {
    try {
      await addMessage.mutateAsync({message, type: 'text'});

      resetFields();
    } catch (err) {
      console.log('error happened when sending message', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable onPressIn={null} onPressOut={null}>
            <MaterialCommunityIcons
              name={recording ? 'microphone' : 'microphone-outline'}
              size={24}
              color={recording ? 'red' : '#595959'}
              style={styles.icon}
            />
          </Pressable>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Send message..."
          />

          <Pressable onPress={() => {}}>
            <Feather
              name="image"
              size={24}
              color="#595959"
              style={styles.icon}
            />
          </Pressable>

          <Pressable onPress={() => {}}>
            <Feather
              name="camera"
              size={24}
              color="#595959"
              style={styles.icon}
            />
          </Pressable>
        </View>

        <Pressable onPress={onPress} style={styles.buttonContainer}>
          {message || image || soundURI ? (
            <Ionicons name="send" size={18} color="white" />
          ) : (
            <Ionicons name="send" size={18} color="lightgray" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dedede',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#3777f0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 35,
  },

  sendImageContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
  },
});

export default MessageInput;
