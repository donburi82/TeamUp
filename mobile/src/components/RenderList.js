import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';

export default function RenderList({
  item: {id, name},
  renderTick,
  setMajorData,
}) {
  return (
    <TouchableOpacity
      style={styles.listBar}
      onPress={() => {
        setMajorData(state => {
          return state.map(item => {
            return item.id === id ? {...item, selected: !item.selected} : item;
          });
        });
      }}>
      <Text style={styles.textStyle}>{name}</Text>
      {renderTick ? <AntIcon name="check" color="#4fbe28" size={20} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listBar: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 30,
  },
  textStyle: {
    color: 'black',
    fontSize: 20,
  },
});
