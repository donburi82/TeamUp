import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ButtonText, Button} from '@gluestack-ui/themed';

import {
  useGetProfilePicQuery,
  useGetUserInfoQuery,
  useGetUserIdQuery,
} from '../utils/query/customHook';
import {useDispatch} from 'react-redux';
import InfoModal from '../components/InfoModal';
import UserBarComponent from '../components/UserBarComponent';
import {logOut} from '../utils/reduxStore/reducer';

import {request} from '../utils/query/requestForReactQuery';

export default function Home() {
  const {data, isLoading, error} = useGetProfilePicQuery();

  const _ = useGetUserInfoQuery();
  const [usersList, setUsersList] = useState([]);
  const splitArray = arr => {
    const splitArray = [];
    for (let i = 0; i < arr?.length; i += 10) {
      splitArray.push(arr.slice(i, i + 10));
    }
    return splitArray;
  };
  const sendRequest = async () => {
    const dataArray = await request('/riverTestUsers', {}, {method: 'get'});
    let splitDataArray = splitArray(dataArray?.data);
    console.log(splitDataArray.length);
    // while (splitedArray.length) {
    //   const processBatch = () => {
    //     console.log(splitedArray.length);
    //     if (splitedArray.length) {
    //       let thisBatch = splitedArray.shift();
    //       setUsersList(prevUsersList => [...prevUsersList, ...thisBatch]);
    //       requestAnimationFrame(processBatch);
    //     }
    //   };
    // }
    // processBatch();
    // setUsersList(dataArray?.data || []);  // 1000条数据出现卡顿

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
    sendRequest();
  }, []);
  return (
    <ScrollView
      // style={{alignItems: 'center'}}
      contentContainerStyle={{alignItems: 'center'}}>
      <InfoModal />

      {usersList.map((item, index) => (
        <UserBarComponent usersList={item} key={index} />
      ))}
    </ScrollView>
  );
}
