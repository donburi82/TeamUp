import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
  useGetProfilePicQuery,
  useGetUserInfoQuery,
  useGetUserIdQuery,
} from '../utils/query/customHook';
import BottomSheetGroup from '../components/BottomSheetGroup';
import {useDispatch} from 'react-redux';

import {ROUTES} from '../navigator/constant';

import GroupBarComponent from '../components/GroupBarComponent';
import {
  request,
  requestURL,
  BASE_URL,
} from '../utils/query/requestForReactQuery';

// function for requesting notification permission andriod

export default function GroupHome({navigation}) {
  const category = ['Your Groups', 'Explore'];
  const [activeButton, setActiveButton] = useState(0);
  const bottomSheetRef = useRef(null);
  const getButtonStyle = buttonId => {
    return buttonId === activeButton
      ? 'rgba(63,43,190,0.80)'
      : 'rgba(63,43,190,0.50)';
  };

  // const splitArray = arr => {
  //   const splitArray = [];
  //   for (let i = 0; i < arr?.length; i += 10) {
  //     splitArray.push(arr.slice(i, i + 10));
  //   }
  //   return splitArray;
  // };
  // const sendRequest = async () => {
  //   const dataArray = await request('/riverTestUsers', {}, {method: 'get'});
  //   let splitDataArray = splitArray(dataArray?.data);
  //   console.log(splitDataArray.length);

  //   let timer; // Declare timer outside so it can be cleared on cleanup
  //   const processBatch = () => {
  //     if (splitDataArray.length) {
  //       let thisBatch = splitDataArray.shift();
  //     //   setUsersList(prevUsersList => [...prevUsersList, ...thisBatch]);
  //       timer = setTimeout(processBatch, 100); // Adjust timeout as needed
  //     }
  //   };

  //   processBatch(); // Start processing batches

  //   // Cleanup function to clear the timeout if the component unmounts
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // };

  //   useEffect(() => {
  //     sendRequest();
  //   }, []);

  return (
    <>
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
      <ScrollView
        // style={{alignItems: 'center'}}

        contentContainerStyle={{alignItems: 'center'}}>
        {[1, 2, 3, 4, 4, 4, 4, 4].map((item, index) => (
          <GroupBarComponent key={index} navigation={navigation} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.fixedButton}
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
      <BottomSheetGroup navigation={navigation} reference={bottomSheetRef} />
    </>
  );
}

const styles = StyleSheet.create({
  containerBar: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 5,
    height: 30,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 10,
  },
  fixedButton: {
    position: 'absolute', // This positions the button over the content
    right: 10, // Distance from the right edge of the screen
    bottom: 10, // Distance from the bottom edge of the screen
    // backgroundColor: 'blue', // Button background color
    // padding: 10, // Button padding
    // borderRadius: 20, // Rounded corners for the button
  },
  plusIcon: {
    margin: 20,
    alignSelf: 'flex-end',
  },
});
