import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

export default function SelectUserBar({callback, name, avartar}) {
  console.log('SelectUserBar', name, avartar, callback);
  const [isActive, setIsActive] = useState(false); // 初始状态为非激活

  // 处理点击事件，切换小绿点的激活状态
  const handlePress = () => {
    setIsActive(!isActive); // 切换状态
  };
  const GreenDot = ({callback}) => {
    return (
      <View style={styles.containerDot}>
        <View style={[styles.dot, isActive ? styles.activeDot : null]} />
      </View>
    );
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <GreenDot callback={callback} />
      <Image
        source={avartar}
        style={{height: 40, width: 40, borderRadius: 30, marginHorizontal: 20}}
      />
      <Text style={{fontWeight: '500', fontSize: 20, color: 'black'}}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    // backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-start',

    alignItems: 'center',
    padding: 10,
  },
  dot: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: '#ccc', // 默认灰色背景
  },
  activeDot: {
    backgroundColor: '#4fbe28', // 激活状态下为绿色
  },
  containerDot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
