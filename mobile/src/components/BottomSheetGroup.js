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
import {
  CourseData,
  category as categoryData,
  projectPeriod,
  QuotaData,
} from '../utils/data';
import {useGetFriendsQuery} from '../utils/query/customHook';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import {ROUTES} from '../navigator/constant';
import {useCreateGroupMutation} from '../utils/query/customHook';
import DebouncedWaitingButton from './DebouncedWaitingButton';
import SelectUserBar from './SelectUserBar';
import {useNavigation} from '@react-navigation/native';

export default function BottomWindow({reference, activeButton}) {
  const [courseCode, setCourseCode] = useState('');
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState('');
  const [groupName, setGroupName] = useState('');
  const [quota, setQuota] = useState(null);
  const [memberList, setMemberList] = useState([]);
  let friendList = [];
  const createGroupHook = useCreateGroupMutation();
  const navigation = useNavigation();

  try {
    const {data} = useGetFriendsQuery();
    friendList = data?.friends ? data?.friends : [];
  } catch (e) {
    console.log('get friends failed', e);
  }
  const resetfield = () => {
    setCourseCode('');
    setCategory('');
    setPeriod('');
    setGroupName('');
    setQuota('');

    reference?.current?.close();
  };
  const handleDone = async () => {
    console.log(courseCode, category, period, groupName, quota, memberList);
    try {
      const room = await createGroupHook.mutateAsync({
        name: groupName,
        category,
        project: courseCode,
        quota,
        members: memberList,
      });
      // console.log('group data is', room);
      resetfield();
      if (room) {
        // console.log('create group success', room);
        setTimeout(() => {
          navigation.navigate(ROUTES.ChatStackNavigator, {
            screen: ROUTES.CHATROOM,
            initial: false,

            params: {id: room, title: groupName, isGroup: true},
          });
        }, 100);
      }
    } catch (e) {
      console.log('create group failed', e);
    }
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
            resetfield();
            reference?.current?.close();
          }}>
          <ButtonText color="black">Cancel</ButtonText>
        </Button>
        <DebouncedWaitingButton
          style={styles.button}
          fontSize="$md"
          bg="#4fbe28"
          disabled={!groupName || !courseCode || !category || !quota}
          opacity={!groupName || !courseCode || !category || !quota ? 0.4 : 1}
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
            key={courseCode}
            setSelected={setCourseCode}
            placeholder={courseCode}
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
            key={category}
            setSelected={setCategory}
            placeholder={category}
            boxStyles={styles.boxStyle}
            search={false}
            data={categoryData}
            dropdownStyles={styles.dropDownStyle}
            save="value"
          />
        </View>

        <View style={{marginBottom: 40}}>
          <Text style={styles.textStyle}>Quota</Text>
          <SelectList
            key={quota}
            setSelected={setQuota}
            placeholder={quota}
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
            userid={item._id}
            name={item.name}
            avartar={item.profilePic}
            callback={item.callback}
            setMemberList={setMemberList}
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
