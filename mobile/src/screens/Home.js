import {
  View,
  Text,
  ScrollView,
  PermissionsAndroid,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';
import Feather from 'react-native-vector-icons/Feather';
import {
  useGetProfilePicQuery,
  useGetUserInfoQuery,
  useGetUserIdQuery,
} from '../utils/query/customHook';
import {unwelcome} from '../utils/reduxStore/reducer';
import {useDispatch} from 'react-redux';
import InfoModal from '../components/InfoModal';
import UserBarComponent from '../components/UserBarComponent';
import {useSelector} from 'react-redux';
import {ROUTES} from '../navigator/constant';
import {store} from '../utils/reduxStore';

import {
  request,
  requestURL,
  BASE_URL,
} from '../utils/query/requestForReactQuery';
import messaging from '@react-native-firebase/messaging';

// function for requesting notification permission andriod
const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can post notifications');
      return true;
    } else {
      console.log('Permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const updateToken = async regToken => {
  try {
    const global = store.getState();
    const {token} = global.userInfo;

    const url = BASE_URL + requestURL.updateRegToken;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        registrationToken: regToken,
      }),
    });

    console.log('this is response', response, '\n');

    if (response.ok) {
      console.log('Token updated successfully');
    } else {
      console.log('Failed to update token');
    }
  } catch (error) {
    console.error('Failed to update token: ', error);
  }
};

export default function Home({navigation}) {
  const {data, isLoading, error} = useGetProfilePicQuery();
  const dispatch = useDispatch();
  const category = ['Course Project', 'Course Study', 'ExtraCurricular'];
  const [activeButton, setActiveButton] = useState(0);
  const userId = useSelector(state => state?.userInfo?.userId);
  const getButtonStyle = buttonId => {
    return buttonId === activeButton
      ? 'rgba(63,43,190,0.80)'
      : 'rgba(63,43,190,0.50)';
  };
  const _ = useGetUserInfoQuery();
  const [usersList, setUsersList] = useState([]);
  const splitArray = arr => {
    //handle large data returned
    const splitArray = [];
    for (let i = 0; i < arr?.length; i += 10) {
      splitArray.push(arr.slice(i, i + 10));
    }
    return splitArray;
  };
  const sendRequest = async () => {
    const dataArray = [];

    if (activeButton === 0) {
      const {data: idArray} = await request(
        'users/courseproject',
        {userId},
        {method: 'get'},
        true,
      );
      console.log('id array is', idArray);
    } else if (activeButton === 1) {
      const result = await request(
        'users/coursestudy',
        {userId},
        {method: 'get'},
        true,
      );
      console.log('coursestudy id array is', result);
    } else {
      const {data: idArray} = await request(
        'users/extracurricular',
        {userId},
        {method: 'get'},
        true,
      );
      console.log('extracurricular id array is', idArray);
    }

    let splitDataArray = splitArray(dataArray?.data);
    console.log(splitDataArray.length);

    let timer; // Declare timer outside so it can be cleared on cleanup
    const processBatch = () => {
      if (splitDataArray.length) {
        let thisBatch = splitDataArray.shift();
        setUsersList(prevUsersList => [...prevUsersList, ...thisBatch]);
        timer = setTimeout(processBatch, 100); // Adjust timeout as needed
      }
    };

    processBatch(); // Start processing batches

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    const requestAndHandleToken = async () => {
      const granted = await requestPermission();

      if (granted === true) {
        try {
          const token = await messaging().getToken();
          await updateToken(token);

          const unsubscribe = messaging().onTokenRefresh(async newToken => {
            await updateToken(newToken);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error('Failed to get token or update token: ', error);
        }
      } else {
        console.log('Permission denied');
      }
    };

    requestAndHandleToken();
  }, []);

  useEffect(() => {
    sendRequest();
  }, [activeButton]);

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
        <Pressable
          onPress={() => {
            dispatch(unwelcome());
          }}
          style={{
            marginLeft: 'auto',
            marginRight: 10,
          }}>
          <Feather name="info" size={24} color="#595959" />
        </Pressable>
      </View>

      <ScrollView
        // style={{alignItems: 'center'}}

        contentContainerStyle={{alignItems: 'center'}}>
        <InfoModal />

        {usersList.map((item, index) => (
          <UserBarComponent
            usersList={item}
            key={index}
            navigation={navigation}
          />
        ))}
      </ScrollView>
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
});
