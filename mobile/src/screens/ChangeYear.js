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
export default function ChangeYear({navigation}) {
  const [year, setYear] = useState('');
  const updateYearMutation = useUpdateInfoMutation();
  const updateYear = async () => {
    const updateIndoPromise = updateYearMutation.mutateAsync({
      year,
    });
    try {
      const result = await updateIndoPromise;
    } catch (error) {
      console.log(error);
    }
    showUpdateToast();
    navigation.goBack();
  };
  const [yearData, setYearData] = useState([
    {id: 0, name: '1', selected: false},
    {id: 1, name: '2', selected: false},
    {id: 2, name: '3', selected: false},
    {id: 3, name: '4', selected: false},
    {id: 4, name: '5', selected: false},
  ]);
  // console.log(year, yearData, !year);
  useEffect(() => {
    console.log('this is use effect');
    setYear(state => {
      let name = '';
      yearData.forEach(item => {
        if (item.selected === true) name = item.name;
      });
      return name;
    });
  }, yearData);
  React.useLayoutEffect(() => {
    console.log('this is  useLayoutEffect');
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
          disabled={!year}
          opacity={!year ? 0.4 : 1}
          onPress={updateYear}
          text="Done"
        />
      ),
    });
  }, [navigation, year]);
  return (
    <View style={styles.container}>
      <FlatList
        data={yearData}
        renderItem={({item}) => (
          <RenderList
            item={item}
            clearBefore={true}
            setData={setYearData}
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
