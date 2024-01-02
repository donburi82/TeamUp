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
          onPress={null}
          text="Done"
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <FlatList
        data={majorData}
        renderItem={({item}) => (
          <RenderList
            item={item}
            setMajorData={setMajorData}
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

    // alignItems: 'flex-start',
    // justifyContent: 'center',
  },
});
