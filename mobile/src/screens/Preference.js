import {View, Text, StyleSheet} from 'react-native';
import {Button, ButtonText, ScrollView} from '@gluestack-ui/themed';
import AntIcon from 'react-native-vector-icons/AntDesign';
import React, {useState} from 'react';
import SettingBar from '../components/SettingBar';
export default function Preference() {
  const [activeButton, setActiveButton] = useState(1);
  const handleButtonPress = buttonId => {
    setActiveButton(buttonId);
  };

  const getButtonStyle = buttonId => {
    return buttonId === activeButton
      ? 'rgba(63,43,190,0.80)'
      : 'rgba(63,43,190,0.50)';
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerBar}>
        <Button bg={getButtonStyle(1)} style={styles.button}>
          <ButtonText style={styles.buttonText}>Course Project</ButtonText>
        </Button>
        <Button bg={getButtonStyle(2)} style={styles.button}>
          <ButtonText style={styles.buttonText}>Course Study</ButtonText>
        </Button>
        <Button bg={getButtonStyle(3)} style={styles.button}>
          <ButtonText style={styles.buttonText}>ExtraCurricular</ButtonText>
        </Button>
      </View>
      <ScrollView style={styles.itemContainer}>
        <SettingBar text="COMP3111" type="groupPreference" />
        <SettingBar text="COMP3211" type="groupPreference" />
        <SettingBar text="COMP3311" type="groupPreference" />
        <SettingBar text="COMP4211" type="groupPreference" />

        <AntIcon
          name="pluscircle"
          size={40}
          color="rgba(63,43,190,0.50)"
          style={styles.plusIcon}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginHorizontal: 5,
    height: 30,
    borderRadius: 50,
  },

  buttonText: {
    fontSize: 10,
  },
  containerBar: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 40,
    width: '100%',
    alignItems: 'center',
  },
  itemContainer: {
    marginTop: -5,

    // backgroundColor: 'yellow',
  },
  plusIcon: {
    margin: 20,
    alignSelf: 'flex-end',
  },
});
