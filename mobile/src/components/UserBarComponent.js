import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import Icon from '../utils/Icon.png';
import {ROUTES} from '../navigator/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function UserBarComponent({usersList, navigation}) {
  let name = 'Jason';
  // let major = 'CPEG';
  let gender = 'M';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        // console.log(navigation);
        // navigation.push(ROUTES.OTHERUSERINFO);
        navigation.navigate(ROUTES.ChatStackNavigator, {
          screen: ROUTES.OTHERUSERINFO,
          initial: false,
          params: {userId: usersList?._id},
        });
      }}>
      <Image source={Icon} style={styles.image} resizeMode="cover" />
      <View style={styles.rightInfo}>
        <View style={styles.topLine}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bigText}>
            {usersList?.name}
          </Text>
          {gender === 'M' ? (
            <MaterialCommunityIcons
              name="gender-male"
              color="rgb(40,200,240)"
              size={30}
              style={{marginLeft: 40}}
            />
          ) : (
            <MaterialCommunityIcons
              name="gender-female"
              color="pink"
              size={30}
              style={{marginLeft: 40}}
            />
          )}
        </View>
        <Text style={{marginTop: 5, color: 'black'}}>
          {usersList?.major.length ? usersList?.major : 'CPEG'}
        </Text>
        <Text
          style={styles.smallText}
          numberOfLines={1}
          ellipsizeMode="tail">{`Looking group mates for ${
          usersList?.groupPreferences[0]?.courseCode ||
          usersList?.groupPreferences[0]?.projectInterest
        } `}</Text>
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
    borderRadius: 30,
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
