import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import Icon from '../utils/demo.png';
import {ROUTES} from '../navigator/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function GroupBarComponent({navigation, group, mode}) {
  let name = 'COMP3111';
  let type = 'Course Project';
  let capacity = '2/3';

  // const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        console.log('navigation to', group?.chatRoomID);
        navigation.push(ROUTES.GroupInfoInGroups, {
          title: group?.project,
          groupId: group?._id,
          myGroup: mode === 'my',
          chatRoomID: group?.chatRoomID,
        });
      }}>
      {group?.avartar ? (
        <Image
          source={{uri: group?.avartar}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Ionicons
          name="people"
          size={50}
          color="gray"
          style={styles.imageBroken}
        />
      )}

      <View style={styles.rightInfo}>
        <View style={styles.topLine}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bigText}>
            {group?.project}
          </Text>
        </View>

        <Text
          style={{
            color: 'white',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(63,43,190,0.50)',
            paddingHorizontal: 5,
            borderRadius: 10,
          }}>
          {group?.category}
        </Text>

        <Text style={styles.smallText} numberOfLines={1}>
          {`Quota: ${group?.quota}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 15,
    width: '90%',
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',

    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    backgroundColor: 'red',

    width: 60,
    height: 60,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  imageBroken: {
    backgroundColor: 'gray',
    textAlign: 'center',
    lineHeight: 60,
    width: 60,
    color: 'white',
    height: 60,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  rightInfo: {
    height: '100%',
    width: '75%',
    marginRight: 100,
  },
  topLine: {
    flexDirection: 'row',
  },

  bigText: {
    fontSize: 25,
    color: 'black',
    fontWeight: '400',
  },
  smallText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '200',
  },
});
