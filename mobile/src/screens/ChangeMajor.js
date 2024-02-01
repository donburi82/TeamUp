import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
import React, {useState, useEffect} from 'react';
import renderList from '../components/RenderList';
import RenderList from '../components/RenderList';
import {useUpdateInfoMutation} from '../utils/query/customHook';
import {showUpdateToast} from '../utils/showToast';
export default function ChangeMajor({navigation}) {
  const [major, setMajor] = useState([]);

  const [majorData, setMajorData] = useState([
    {id: 0, name: 'ACCT', selected: false},
    {id: 1, name: 'COMP', selected: false},
    {id: 2, name: 'CPEG', selected: false},
    {id: 3, name: 'MATH', selected: false},
    {id: 4, name: 'MECH', selected: false},
    {id: 5, name: 'OCEA', selected: false},
  ]);

  const updateMajorMutation = useUpdateInfoMutation();
  const updateMajor = async () => {
    console.log('major is', major, majorData);
    const updateIndoPromise = updateMajorMutation.mutateAsync({
      major,
    });
    try {
      const result = await updateIndoPromise;
    } catch (error) {
      console.log(error);
    }
    showUpdateToast();
    navigation.goBack();
  };

  useEffect(() => {
    setMajor(state => {
      const name = [];
      majorData.forEach(item => {
        if (item.selected === true) name.push(item.name);
      });

      return name;
    });
  }, majorData);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color: 'black'}}>Cancel</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <DebouncedWaitingButton
          style={styles.button}
          fontSize="$sm"
          bg="#4fbe28"
          disabled={!major}
          opacity={!major ? 0.4 : 1}
          onPress={updateMajor}
          text="Done"
        />
      ),
    });
  }, [navigation, major]);
  return (
    <View style={styles.container}>
      <FlatList
        data={majorData}
        renderItem={({item}) => (
          <RenderList
            item={item}
            setData={setMajorData}
            renderTick={item.selected}
            clearOther
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
  },
  button: {
    width: 75,
    height: 30,
  },
});
