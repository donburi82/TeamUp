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
import {
  useAddCourseProjectMutation,
  useAddCourseStudyMutation,
  useAddExtracurricularMutation,
} from '../utils/query/customHook';
import {ScrollView} from 'react-native-gesture-handler';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import DebouncedWaitingButton from './DebouncedWaitingButton';
import {CourseData, GradeData, skillData, languageData} from '../utils/data';

function CourseProject({
  setCourseCode,
  projectInterest,
  setProjectInterest,
  experience,
  setExperience,
  setTargetGrade,
  skillset,
  setSkillset,
}) {
  return (
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
      </View>
      <View>
        <Text style={styles.textStyle}>Skillset</Text>

        <MultipleSelectList
          setSelected={setSkillset}
          placeholder={' '}
          boxStyles={styles.boxStyle}
          dropdownStyles={styles.dropDownStyle}
          search={true}
          data={skillData}
          save="value"
        />
      </View>
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
      </View>
    </ScrollView>
  );
}
function CourseStudy({setCourseCode, setPreferredLanguage, setTargetGrade}) {
  return (
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
        <Text style={styles.textStyle}>Preferred Language</Text>
        <SelectList
          setSelected={setPreferredLanguage}
          placeholder={' '}
          boxStyles={styles.boxStyle}
          dropdownStyles={styles.dropDownStyle}
          search={false}
          data={languageData}
          label="Categories"
          save="value"
        />
      </View>
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
    </ScrollView>
  );
}
function ExtraCurricular({
  setPreferredLanguage,
  projectInterest,
  setProjectInterest,
  experience,
  setExperience,
  setSkillset,
}) {
  return (
    <ScrollView style={styles.container}>
      <View>
        <View>
          <Text style={styles.textStyle}>Preferred Language</Text>
          <SelectList
            setSelected={setPreferredLanguage}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            dropdownStyles={styles.dropDownStyle}
            search={false}
            data={languageData}
            label="Categories"
            save="value"
          />
        </View>
        <View>
          <Text style={styles.textStyle}>Skillset</Text>

          <MultipleSelectList
            setSelected={setSkillset}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            dropdownStyles={styles.dropDownStyle}
            search={true}
            data={skillData}
            save="value"
          />
        </View>
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
      </View>
    </ScrollView>
  );
}
export default function BottomWindow({reference, activeButton}) {
  const [courseCode, setCourseCode] = useState('');
  const [projectInterest, setProjectInterest] = useState('');
  const [experience, setExperience] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [skillset, setSkillset] = useState([]);
  const addCP = useAddCourseProjectMutation();
  const addCS = useAddCourseStudyMutation();
  const addE = useAddExtracurricularMutation();
  const handleDone = () => {
    if (activeButton === 0) {
      addCP
        .mutateAsync(
          courseCode,
          projectInterest,
          skillset,
          targetGrade,
          experience,
        )
        .then(() => {
          setCourseCode('');
          setProjectInterest('');
          setExperience('');
          setTargetGrade('');
          setPreferredLanguage('');
          setSkillset([]);
        });
    } else if (activeButton === 1) {
      addCS.mutateAsync(courseCode, targetGrade, preferredLanguage).then(() => {
        setCourseCode('');
        setProjectInterest('');
        setExperience('');
        setTargetGrade('');
        setPreferredLanguage('');
        setSkillset([]);
      });
    } else if (activeButton === 2) {
      addE
        .mutateAsync(projectInterest, skillset, experience, preferredLanguage)
        .then(() => {
          setCourseCode('');
          setProjectInterest('');
          setExperience('');
          setTargetGrade('');
          setPreferredLanguage('');
          setSkillset([]);
        });
    }

    reference?.current?.close();
  };
  useEffect(() => {
    setCourseCode('');
    setProjectInterest('');
    setExperience('');
    setTargetGrade('');
    setPreferredLanguage('');
    setSkillset([]);
  }, [activeButton]);
  // variables
  const snapPoints = ['93%'];
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
          {/* <ButtonText color="black">Cancel </ButtonText> */}
          <Text style={{color: 'black'}}>Cancel</Text>
        </Button>
        <DebouncedWaitingButton
          style={styles.button}
          fontSize="$md"
          bg="#4fbe28"
          disabled={
            (!courseCode && activeButton === 0) ||
            (!courseCode && activeButton === 1) ||
            (activeButton === 2 && !projectInterest)
          }
          opacity={
            (!courseCode && activeButton === 0) ||
            (!courseCode && activeButton === 1) ||
            (activeButton === 2 && !projectInterest)
              ? 0.4
              : 1
          }
          onPress={handleDone}
          text="Done "
        />
      </View>
      {activeButton === 0 ? (
        <CourseProject
          setCourseCode={setCourseCode}
          projectInterest={projectInterest}
          setProjectInterest={setProjectInterest}
          experience={experience}
          setExperience={setExperience}
          setTargetGrade={setTargetGrade}
          skillset={skillset}
          setSkillset={setSkillset}
        />
      ) : activeButton === 1 ? (
        <CourseStudy
          setCourseCode={setCourseCode}
          setTargetGrade={setTargetGrade}
          setPreferredLanguage={setPreferredLanguage}
        />
      ) : (
        <ExtraCurricular
          projectInterest={projectInterest}
          setProjectInterest={setProjectInterest}
          experience={experience}
          setExperience={setExperience}
          setPreferredLanguage={setPreferredLanguage}
          skillset={skillset}
          setSkillset={setSkillset}
        />
      )}
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
