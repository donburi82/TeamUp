import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, InputField, Button, ButtonText} from '@gluestack-ui/themed';
import React, {useRef, useState, useEffect} from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import {SelectList} from 'react-native-dropdown-select-list';
import DebouncedWaitingButton from './DebouncedWaitingButton';
export default function BottomWindow() {
  const bottomSheetRef = useRef(null);
  const [courseCode, setCourseCode] = useState('');
  const [projectInterest, setProjectInterest] = useState('');
  const [experience, setExperience] = useState('');

  // variables
  const snapPoints = ['93%'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleComponent={null}
      style={{borderRadius: 100}}
      backgroundStyle={{
        backgroundColor: '#f0f0f0',
      }}
      enablePanDownToClose={false} // Disables dragging down to close
      enableContentPanningGesture={false}>
      <View style={styles.buttonBar}>
        <Button bg={null} style={styles.button}>
          <ButtonText color="black">Cancel</ButtonText>
        </Button>
        <DebouncedWaitingButton
          style={styles.button}
          bg="#4fbe28"
          disabled={!courseCode}
          opacity={!courseCode ? 0.4 : 1}
          onPress={null}
          text="Done"
        />
      </View>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.textStyle}>Course Code</Text>
          <SelectList
            setSelected={null}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            search={false}
            data={null}
            save="value"
          />
        </View>
        <View>
          <Text style={styles.textStyle}>Project Interest</Text>

          <Input style={styles.boxStyle}>
            <InputField
              placeholder=""
              type="text"
              style={{fontSize: 15}}
              onChangeText={setCourseCode}
            />
          </Input>
        </View>
        <View>
          <Text style={styles.textStyle}>Skillset</Text>
          <View style={styles.skillRow}>
            <SelectList
              setSelected={null}
              placeholder={' '}
              boxStyles={styles.boxStyle}
              search={false}
              data={null}
              save="value"
            />
            <TouchableOpacity>
              <EntypoIcon
                name="circle-with-cross"
                size={20}
                color="red"
                style={{marginLeft: -30}}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <AntIcon
              name="pluscircle"
              size={40}
              color="rgba(63,43,190,0.50)"
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.textStyle}>Target Grade</Text>
          <SelectList
            setSelected={null}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            search={false}
            data={null}
            save="value"
          />
        </View>
        <View>
          <Text style={styles.textStyle}>Experience</Text>

          <Input style={styles.boxStyle}>
            <InputField
              placeholder=""
              type="text"
              style={{fontSize: 15}}
              onChangeText={setCourseCode}
            />
          </Input>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
    paddingLeft: 20,
  },
  buttonBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 90,
    height: 40,
  },
  innerContainer: {},
  textStyle: {
    color: 'rgba(60,40,190,0.60)',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  boxStyle: {
    elevation: 0,
    height: 40,
    shadowOpacity: 0,
    borderWidth: 0,
    backgroundColor: '#d9d9d9',
    borderRadius: 50,
    width: '90%',
    // backgroundColor: 'yellow',
  },
  skillRow: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  plusIcon: {
    margin: 10,
  },
});
