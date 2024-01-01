import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {logOut} from '../utils/reduxStore/reducer';
import {useDispatch} from 'react-redux';
import Alert from './Alert';
import {useNavigation} from '@react-navigation/native';
export default function SettingBar({text, type, destination, children}) {
  if (type === 'signOut') {
    const [alertOpen, setAlertOpen] = useState(false);
    const dispatch = useDispatch();
    return (
      <TouchableOpacity
        style={styles.barContainer}
        onPress={() => {
          setAlertOpen(true);
        }}>
        <View style={{flex: 1}}>
          <Alert
            open={alertOpen}
            setOpen={setAlertOpen}
            handleCancel={() => {
              setAlertOpen(false);
            }}
            handleConfirm={() => {
              dispatch(logOut());
            }}
          />
          <Text style={{...styles.textStyle, color: 'red'}}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  if (type === 'groupPreference') {
    return (
      <TouchableOpacity style={styles.barContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.textStyle}>{text}</Text>
          <TouchableOpacity>
            <EntypoIcon name="circle-with-cross" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  if (type === 'basicInfo') {
    return (
      <TouchableOpacity
        style={styles.barContainer}
        onPress={() => {
          navigation.navigate(destination);
        }}>
        <View style={styles.innerContainer}>
          <Text style={styles.textStyle}>{text}</Text>
          <View style={styles.rightPart}>
            {children}
            <AntIcon name="right" size={20} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.barContainer}
      onPress={() => {
        navigation.navigate(destination);
      }}>
      <View style={styles.innerContainer}>
        <Text style={styles.textStyle}>{text}</Text>
        <AntIcon name="right" size={20} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  innerContainer: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    // alignSelf: '',
    color: 'black',
    fontSize: 20,
  },
  rightPart: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 30,
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
});
