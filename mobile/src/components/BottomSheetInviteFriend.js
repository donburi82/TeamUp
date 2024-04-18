import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Button, ButtonText} from '@gluestack-ui/themed';
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
import {
  useGetFriendsQuery,
  useAddMemberMutation,
} from '../utils/query/customHook';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import {ROUTES} from '../navigator/constant';
import {useCreateGroupMutation} from '../utils/query/customHook';
import DebouncedWaitingButton from './DebouncedWaitingButton';
import SelectUserBar from './SelectUserBar';
import {useNavigation} from '@react-navigation/native';

export default function BottomSheetInviteFriend({
  reference,
  activeButton,
  groupId,
}) {
  const [memberList, setMemberList] = useState([]);
  let friendList = [];
  // const createGroupHook = useCreateGroupMutation();
  const navigation = useNavigation();
  const addMemberHook = useAddMemberMutation();
  try {
    const {data} = useGetFriendsQuery();
    friendList = data?.friends ? data?.friends : [];
  } catch (e) {
    console.log('get friends failed', e);
  }
  const resetfield = () => {
    reference?.current?.close();
  };
  const handleDone = async () => {
    try {
      addMemberHook.mutateAsync({
        groupId,
        members: memberList,
      });
      // const room = await createGroupHook.mutateAsync({
      //   name: groupName,
      //   category,
      //   project: courseCode,
      //   quota,
      //   members: memberList,
      // });

      resetfield();
    } catch (e) {
      console.log('invite friend failed', e);
    }
  };

  // variables
  const snapPoints = ['50%'];
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
          disabled={memberList.length === 0}
          opacity={memberList.length === 0 ? 0.4 : 1}
          onPress={handleDone}
          text="Done"
        />
      </View>
      <ScrollView style={styles.container}>
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
