import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import moment from 'moment';

export default function MessageBubble({message}) {
  const {
    senderName,
    setAsMessageReply,
    messageData,
    senderId,
    isAllRead: isMessageRead,
  } = message;
  const userId = useSelector(state => state?.userInfo?.userId);
  //   const isMyMessage = false;
  const isMyMessage = senderId === userId;

  return (
    <View
      style={{
        ...styles.messageContainer,
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        backgroundColor: isMyMessage ? '#dfffc7' : '#dddddd',
        borderTopLeftRadius: isMyMessage ? 5 : 0,
        borderTopRightRadius: isMyMessage ? 0 : 5,
      }}>
      {!isMyMessage && <View style={styles.leftMessageArrow} />}
      <View style={{...styles.nameAndTime, marginTop: isMyMessage ? -10 : -20}}>
        <Text style={styles.nameStyle}>{senderName}</Text>
        <View
          style={{
            ...styles.timeAndReadContainer,
          }}>
          <Text style={styles.timeText}>
            {moment(message.sentDate).format('HH:mm A')}
          </Text>
          <View>
            {isMessageRead ? (
              <MaterialCommunityIcons name="read" size={16} color="#5bb6c9" />
            ) : (
              <MaterialCommunityIcons name="check" size={16} color="grey" />
            )}
          </View>
          {isMyMessage && <View style={styles.rightMsgArrow}></View>}
        </View>
      </View>
      <Text style={styles.messageText}>{messageData}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  messageContainer: {
    width: '70%',
    marginVertical: 3,
    marginHorizontal: 16,
    paddingVertical: 10,

    paddingRight: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
  },
  leftMessageArrow: {
    height: 0,
    width: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',

    borderTopColor: '#ddd',

    borderTopWidth: 10,
    alignSelf: 'flex-start',
    borderRightColor: 'black',
    right: 10,
    bottom: 10,
  },
  nameAndTime: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: -10,
  },
  nameStyle: {
    fontSize: 14,
    color: 'rgba(63, 43, 190, 0.7)',
    fontWeight: '800',

    width: '65%',
    marginHorizontal: 10,
  },
  messageText: {
    fontSize: 16,
    width: '95%',
    marginHorizontal: 10,
  },
  timeAndReadContainer: {
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 12,
    color: '#7e8689',
  },
  rightMsgArrow: {
    height: 0,
    width: 0,
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: '#e7ffdb',
    borderTopWidth: 10,
    alignSelf: 'flex-start',
    left: 10,
    bottom: 0,
  },
});
