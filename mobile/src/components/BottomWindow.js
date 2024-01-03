import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Input, InputField, Button, ButtonText} from '@gluestack-ui/themed';
import React, {useRef, useState, useEffect} from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import DebouncedWaitingButton from './DebouncedWaitingButton';
import {CourseData, GradeData, skillData} from '../utils/data';
export default function BottomWindow({reference}) {
  // const bottomSheetRef = useRef(null);
  const [courseCode, setCourseCode] = useState('');
  const [projectInterest, setProjectInterest] = useState('');
  const [experience, setExperience] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [skillset, setSkillset] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // variables
  const snapPoints = ['93%'];
  const addSkill = () => {
    setSkillset([...skillset, newSkill]);
    setNewSkill(''); // Reset newSkill after adding
  };

  const deleteSkill = index => {
    const updatedSkills = skillset.filter((_, idx) => idx !== index);
    setSkillset(updatedSkills);
  };
  return (
    <BottomSheet
      ref={reference}
      index={-1}
      snapPoints={snapPoints}
      handleComponent={null}
      style={{borderRadius: 100}}
      backgroundStyle={{
        backgroundColor: '#f0f0f0',
      }}
      enablePanDownToClose={false} // Disables dragging down to close
      enableContentPanningGesture={false}>
      <View style={styles.buttonBar}>
        <Button
          bg={null}
          style={{...styles.button, width: 90}}
          onPress={() => {
            reference?.current?.close();
          }}>
          <ButtonText color="black">Cancel</ButtonText>
        </Button>
        <DebouncedWaitingButton
          style={styles.button}
          fontSize="$md"
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
            setSelected={setCourseCode}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            search={false}
            data={CourseData}
            dropdownStyles={styles.dropDownStyle}
            save="value"
          />
        </View>
        <View>
          <Text style={styles.textStyle}>Project Interest</Text>
          <TextInput
            style={{
              ...styles.boxStyle,
              borderRadius: 0,
              textAlignVertical: 'top',
            }}
            multiline
            numberOfLines={4} // You can adjust the number of lines
            onChangeText={setProjectInterest}
            value={projectInterest}
            placeholder=" "
          />
          {/* <Input
            style={{
              ...styles.boxStyle,
              borderRadius: 0,
              height: 100,
             
            }}>
            <InputField
              placeholder=""
              type="text"
              style={{fontSize: 15}}
              onChangeText={setProjectInterest}
            />
          </Input> */}
        </View>
        <View>
          <Text style={styles.textStyle}>Skillset</Text>

          {/* <View style={styles.skillRow}> */}
          <MultipleSelectList
            setSelected={setSkillset}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            dropdownStyles={styles.dropDownStyle}
            // searchInputStyle={{backgroundColor: 'red'}}
            // labelStyles={{marginTop: -40, position: 'absolute', zIndex: 9}}

            search={true}
            data={skillData}
            save="value"
          />
          {/* <TouchableOpacity>
              <EntypoIcon
                name="circle-with-cross"
                size={20}
                color="red"
                style={{marginLeft: -30}}
              />
            </TouchableOpacity> */}
        </View>

        {/* <TouchableOpacity onPress={addSkill}>
            <AntIcon
              name="pluscircle"
              size={40}
              color="rgba(63,43,190,0.50)"
              style={styles.plusIcon}
            />
          </TouchableOpacity> */}
        {/* </View> */}
        <View>
          <Text style={styles.textStyle}>Target Grade</Text>
          <SelectList
            setSelected={setTargetGrade}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            dropdownStyles={styles.dropDownStyle}
            search={false}
            data={GradeData}
            label="Categories"
            save="value"
          />
        </View>
        <View>
          <Text style={styles.textStyle}>Experience</Text>
          <TextInput
            style={{
              ...styles.boxStyle,
              borderRadius: 0,
              textAlignVertical: 'top',
            }}
            multiline
            numberOfLines={4} // You can adjust the number of lines
            onChangeText={setExperience}
            value={experience}
            placeholder=" "
          />
          {/* <Input style={{...styles.boxStyle, borderRadius: 0, height: 100}}>
            <InputField
              numberOfLines={4}
              placeholder=""
              type="text"
              style={{fontSize: 15}}
              onChangeText={setCourseCode}
            />
          </Input> */}
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
    width: 80,
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
    minHeight: 40,
    shadowOpacity: 0,
    borderWidth: 0,
    backgroundColor: '#d9d9d9',
    borderRadius: 50,
    width: '90%',

    // backgroundColor: 'yellow',
  },
  dropDownStyle: {
    width: 350,
  },
  skillRow: {
    // backgroundColor: 'red',
    marginBottom: 20,
    flexDirection: 'row',
    // width: '65%',
    width: 250,

    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  plusIcon: {
    margin: 10,
  },
});
