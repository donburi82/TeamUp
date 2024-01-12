import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, ButtonText, ScrollView} from '@gluestack-ui/themed';
import {
  useGetCourseProjectQuery,
  useGetExtracurricularQuery,
  useGetCourseStudyQuery,
} from '../utils/query/customHook';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import React, {useState, useRef, useEffect} from 'react';
import SettingBar from '../components/SettingBar';
import BottomWindow from '../components/BottomWindow';

export default function Preference() {
  const [activeButton, setActiveButton] = useState(0);
  const [renderList, setRenderList] = useState([]);
  const bottomSheetRef = useRef(null);
  const userId = useSelector(state => state?.userInfo?.userId);
  const category = ['Course Project', 'Course Study', 'ExtraCurricular'];
  const {data: courseProject} = useGetCourseProjectQuery(userId);
  const {data: extracurricular} = useGetExtracurricularQuery(userId);
  const {data: courseStudy} = useGetCourseStudyQuery(userId);
  // console.log(courseProject, extracurricular, courseStudy);
  useEffect(() => {
    setRenderList(state => {
      let ls = [];
      if (activeButton === 0) ls = courseProject || [];
      else if (activeButton === 1) ls = courseStudy || [];
      else {
        ls = extracurricular || [];
      }
      return ls;
    });
  }, [activeButton, courseProject, extracurricular, courseStudy]);

  const getButtonStyle = buttonId => {
    return buttonId === activeButton
      ? 'rgba(63,43,190,0.80)'
      : 'rgba(63,43,190,0.50)';
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerBar}>
        {category.map((item, index) => {
          return (
            <Button
              key={index}
              bg={getButtonStyle(index)}
              style={styles.button}
              onPress={() => {
                setActiveButton(index);
              }}>
              <ButtonText style={styles.buttonText}>{item}</ButtonText>
            </Button>
          );
        })}
      </View>
      <ScrollView style={styles.itemContainer}>
        {renderList.map((item, index) => {
          return (
            <SettingBar
              key={index}
              text={item.courseCode ? item.courseCode : item.projectInterest}
              preferenceId={item?._id}
              preferenceType={item?.__t}
              type="groupPreference"
            />
          );
        })}

        <TouchableOpacity
          onPress={() => {
            bottomSheetRef?.current?.expand();
          }}>
          <AntIcon
            name="pluscircle"
            size={40}
            color="rgba(63,43,190,0.50)"
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      </ScrollView>
      <BottomWindow reference={bottomSheetRef} />
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
