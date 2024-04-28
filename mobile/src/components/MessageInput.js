import React, {useState, useEffect, useRef} from 'react';
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
  PermissionsAndroid,
} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/core';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSendMessageMutation} from '../utils/query/customHook';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import {v4 as uuidv4} from 'uuid';
import mime from 'mime';
import {store} from '../utils/reduxStore';
import {BASE_URL} from '../utils/query/requestForReactQuery';
// import { Audio, AVPlaybackStatus } from "expo-av";
// import AudioPlayer from "../AudioPlayer";
// import MessageComponent from "../Message";
// import { ChatRoomUser } from "../../src/models";

const MessageInput = ({id, socket}) => {
  const [message, setMessage] = useState('');
  const senderId = store.getState(state => state?.userInfo?.userId);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [soundURI, setSoundURI] = useState(null);
  const [formData, setFormData] = useState(null);
  const [permissions, setPermissions] = useState(false);
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

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the microphone');
        setPermissions(true);
        return true;
      } else {
        console.log('Audio recording permission not granted');
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const microphoneStatus = await check(PERMISSIONS.IOS.MICROPHONE);
      if (microphoneStatus === RESULTS.GRANTED) {
        console.log('You can use the microphone');
        return true;
      } else if (microphoneStatus === RESULTS.DENIED) {
        const requestStatus = await request(PERMISSIONS.IOS.MICROPHONE);
        if (requestStatus === RESULTS.GRANTED) {
          console.log('You can use the microphone');
          setPermissions(true);
          return true;
        } else {
          console.log('Microphone permission denied');
          return false;
        }
      } else {
        console.log('Microphone permission denied');
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const getPermission = async () => {
      await requestAudioPermission();
    };

    getPermission();
  }, []);

  const sendAudio = () => {
    // try {
    //   socket.emit('sendMessage', {
    //     chatRoomId: id,
    //     type: 'audio',
    //     message: formData,
    //     fileName: mime.getType(image).split('/')[1],
    //   });
    // } catch (error) {
    //   console.log('error happened when sending message', err);
    // }
  };
  const sendImage = async () => {
    try {
      console.log(mime.getType(image).split('/')[1], formData);
      socket.emit('sendMessage', {
        chatRoomId: id,
        type: 'image',
        message: formData,
        fileName: mime.getType(image).split('/')[1],
      });

      resetFields();
    } catch (err) {
      console.log('error happened when sending message', err);
    }
  };
  const resetFields = () => {
    setMessage('');

    setImage(null);
    setProgress(0);
    setSoundURI(null);
    setFormData(null);
  };

  const sendMessage = async () => {
    try {
      // await addMessage.mutateAsync({message, type: 'text'});

      socket.emit('sendMessage', {
        chatRoomId: id,
        type: 'text',
        message,
      });

      resetFields();
    } catch (err) {
      console.log('error happened when sending message', err);
    }
  };
  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       const libraryResponse =
  //         await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
  //       // await Audio.requestPermissionsAsync();

  //       if (
  //         libraryResponse.status !== 'granted' ||
  //         photoResponse.status !== 'granted'
  //       ) {
  //         alert('Sorry, we need camera roll permissions to make this work!');
  //       }
  //     }
  //   })();
  // }, []);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.8,
      maxHeight: 400,
      maxWidth: 400,
    };

    launchImageLibrary(options).then(async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;

        const base64Image = await RNFS.readFile(imageUri, 'base64');
        setImage(imageUri);
        setFormData(base64Image);
      }
    });
  };

  const takePhoto = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.4,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchCamera(options).then(async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;

        const base64Image = await RNFS.readFile(imageUri, 'base64');
        setImage(imageUri);
        setFormData(base64Image);
      }
    });
  };

  const progressCallback = progress => {
    setProgress(progress.loaded / progress.total);
  };
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer());

  // const startRecording = async () => {
  //   const result = await audioRecorderPlayer.startRecorder();
  //   audioRecorderPlayer.addRecordBackListener(e => {
  //     console.log('recording', e);
  //     return;
  //   });
  //   console.log(result);
  // };

  const startRecording = async () => {
    if (!permissions) {
      console.log('Audio recording permission not granted');
      return;
    }
    try {
      console.log('start recording');
      // const fileExtension = Platform.OS === 'ios' ? 'm4a' : 'mp4';
      const fileExtension = 'm4a';
      const path = `${RNFetchBlob.fs.dirs.CacheDir}/audioFile.${fileExtension}`;
      setAudioPath(path);
      const audioFile = await audioRecorderPlayerRef.current.startRecorder(
        path,
      );
      console.log('audioFile:', audioFile);
      setRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayerRef.current.stopRecorder();
    setRecording(false);
    // const fileExtension = Platform.OS === 'ios' ? 'm4a' : 'mp4';
    const fileExtension = 'm4a';
    const global = store.getState();
    const {token} = global.userInfo;

    // const fileExists = await RNFS.exists(audioPath);
    // console.log('File exists:', fileExists);
    // const audiodata = await readFile(audioPath);
    // console.log('audio data', audiodata);

    RNFetchBlob.fetch(
      'POST',
      `${BASE_URL}chat/upload`,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
      [
        {
          name: 'file',
          filename: `audioFile.${fileExtension}`,
          type: `audio/${fileExtension}`,
          data: RNFetchBlob.wrap(audioPath),
        },
      ],
    )
      .then(resp => {
        const data = JSON.parse(resp.data);
        console.log('upload success audio');
        if (data.status === 'success') {
          console.log('emit message');
          const key = data.key;
          try {
            socket.emit('sendMessage', {
              chatRoomId: id,
              type: 'audio',
              message: key,
            });
          } catch (error) {
            console.log('error happened when sending message', err);
          }
        }
      })
      .catch(err => {
        console.log('upload error:', err);
      });
  };

  // const stopRecording = async () => {
  //   const result = await audioRecorderPlayer.stopRecorder();
  //   audioRecorderPlayer.removeRecordBackListener();
  //   return result; // This result will be the path to the recorded file
  // };

  const readFile = async filePath => {
    try {
      const base64Audio = await RNFS.readFile(filePath, 'base64');
      return base64Audio;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      {image && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{uri: image}}
            style={{width: 100, height: 100, borderRadius: 10}}
          />

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignSelf: 'flex-end',
            }}>
            <View
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: '#3777f0',
                width: `${progress * 100}%`,
              }}
            />
          </View>

          <Pressable onPress={() => setImage(null)}>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={{margin: 5}}
            />
          </Pressable>
        </View>
      )}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          {/* <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
            <MaterialCommunityIcons
              name={recording ? 'microphone' : 'microphone-outline'}
              size={24}
              color={recording ? 'red' : '#595959'}
              style={styles.icon}
            />
          </Pressable> */}
          <TextInput
            editable
            multiline
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Send message..."
          />

          <Pressable onPress={openImagePicker}>
            <Feather
              name="image"
              size={24}
              color="#595959"
              style={styles.icon}
            />
          </Pressable>

          <Pressable onPress={takePhoto}>
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
