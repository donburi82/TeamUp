import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BasicInfoUser({
  name,
  gender,
  isFullTime,
  nationality,
  profilePic,
}) {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: null}}
        alt="avartar"
        style={{
          width: 150,
          height: 150,
          marginRight: 30,
          borderRadius: 100,
          backgroundColor: 'gray',
        }}
      />
      <View style={styles.rightSide}>
        <View style={styles.rightSideBar}>
          <Text style={styles.nameStyle}>{name}</Text>
          {gender === 'M' ? (
            <MaterialCommunityIcons
              name="gender-male"
              color="rgb(40,200,240)"
              size={30}
            />
          ) : (
            <MaterialCommunityIcons name="gender-female" color="pink" />
          )}
        </View>
        {isFullTime ? (
          <Text style={styles.textStyle}>Full-time Student</Text>
        ) : (
          <Text style={styles.textStyle}>Part-time Student</Text>
        )}

        <Text style={styles.textStyle}>{nationality}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  nameStyle: {
    fontSize: 25,
    color: 'black',
    marginRight: 20,
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 18,
    color: 'black',
  },
  rightSide: {},
  rightSideBar: {
    flexDirection: 'row',
  },
});