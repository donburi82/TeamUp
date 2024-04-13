import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  Input,
  InputField,
  Button,
  ButtonText,
  Select,
  set,
} from '@gluestack-ui/themed';
import React, {useRef, useState, useEffect} from 'react';

import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {CourseData, category, projectPeriod, QuotaData} from '../utils/data';
import {useGetFriendsQuery} from '../utils/query/customHook';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import DebouncedWaitingButton from './DebouncedWaitingButton';
import SelectUserBar from './SelectUserBar';

export default function BottomWindow({reference, activeButton}) {
  const [courseCode, setCourseCode] = useState('');
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState('');
  const [groupName, setGroupName] = useState('');
  const [quota, setQuota] = useState(null);
  let friendList = [];

  try {
    const {data} = useGetFriendsQuery();
    friendList = data?.friends ? data?.friends : [];
  } catch (e) {
    console.log('get friends failed', e);
  }
  const handleDone = () => {
    reference?.current?.close();
  };

  // variables
  const snapPoints = ['100%'];
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
          disabled={false}
          opacity={false ? 0.4 : 1}
          onPress={handleDone}
          text="Done"
        />
      </View>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.textStyle}>Group Name</Text>
          <TextInput
            style={{
              ...styles.boxStyle,
              paddingLeft: 20,
              // borderRadius: 0,
              // textAlignVertical: 'top',
            }}
            // multiline
            numberOfLines={1} // You can adjust the number of lines
            onChangeText={setGroupName}
            value={groupName}
            placeholder=" "
          />
        </View>
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
          <Text style={styles.textStyle}>Category</Text>
          <SelectList
            setSelected={setCategory}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            search={false}
            data={category}
            dropdownStyles={styles.dropDownStyle}
            save="value"
          />
        </View>

        <View style={{marginBottom: 40}}>
          <Text style={styles.textStyle}>Quota</Text>
          <SelectList
            setSelected={setQuota}
            placeholder={' '}
            boxStyles={styles.boxStyle}
            search={false}
            data={QuotaData}
            dropdownStyles={styles.dropDownStyle}
            save="value"
          />
        </View>
        {/* <Text style={styles.textStyle}>Select Users</Text> */}
        {friendList?.map((item, index) => (
          <SelectUserBar
            key={index}
            name={item.name}
            avartar={item.profilePic}
            callback={item.callback}
          />
        ))}
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
