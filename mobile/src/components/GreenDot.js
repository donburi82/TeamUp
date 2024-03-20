import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const BlueDot = ({callback}) => {
  const [isActive, setIsActive] = useState(false); // 初始状态为非激活

  // 处理点击事件，切换小绿点的激活状态
  const handlePress = () => {
    setIsActive(!isActive); // 切换状态
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={[styles.dot, isActive ? styles.activeDot : null]} />
      </TouchableOpacity>
    </View>
  );
};

// 定义样式
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default BlueDot;
