import {View} from 'react-native';
import React from 'react';
import {ButtonText, Button, InputField} from '@gluestack-ui/themed';
import {useDispatch} from 'react-redux';
import {SelectList} from 'react-native-dropdown-select-list';
import {logOut, update} from '../utils/reduxStore/reducer';
import {useUpdateInfoMutation} from '../utils/query/customHook';
import {request, requestURL} from '../utils/query/requestForReactQuery';
import {StyleSheet} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
import RNFS from 'react-native-fs';
import mime from 'mime';
import {
  Image,
  HStack,
  Box,
  VStack,
  Center,
  Text,
  Input,
  ScrollView,
  Pressable,
} from '@gluestack-ui/themed';

export default function InfoFilling() {
  const dispatch = useDispatch();
  const updateInfo = useUpdateInfoMutation();

  const dataGender = [
    {key: '1', value: 'male'},
    {key: '2', value: 'female'},
  ];
  const dataFullTime = [
    {key: '1', value: 'Yes'},
    {key: '2', value: 'No'},
  ];
  const dataMajor = [
    {key: '1', value: 'COMP'},
    {key: '2', value: 'CPEG'},
  ];
  const dataYear = [
    {key: '1', value: '1'},
    {key: '2', value: '2'},
    {key: '3', value: '3'},

    {key: '4', value: '4'},
    {key: '5', value: '5'},
    // {key: '6', value: 'Graduate'},
  ];
  const dataOrigin = [
    {key: '1', value: 'Mainland'},
    {key: '2', value: 'Taiwan'},
    {key: '3', value: 'Hong Kong'},
    {key: '4', value: 'Macau'},
    {key: '5', value: 'Korea'},
    {key: '6', value: 'Japna'},
    {key: '7', value: 'India'},
    {key: '8', value: 'France'},
    {key: '9', value: 'Other'},
  ];

  const [formData, setFormData] = React.useState(null);
  const [firstname, setFirstName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [gender, setGender] = React.useState('M');
  const [origin, setOrigin] = React.useState(dataOrigin[0].value);
  const [isFullTime, setFullTime] = React.useState(true);
  const [major, setMajor] = React.useState(dataMajor[0].value);
  const [year, setYear] = React.useState(dataYear[0].value);
  const [imageUri, setSelectedImage] = React.useState('');
  // const dispatch = useDispatch();
  // const logout = () => {
  //   dispatch(logOut());
  // };
  const openImagePicker = () => {
    console.log('open');
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.6,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(options).then(async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log(response.type, mime.getType(imageUri));
        setSelectedImage(imageUri);
        const base64Image = await RNFS.readFile(imageUri, 'base64');
        setFormData(base64Image);
      }
    });
  };

  return (
    <ScrollView>
      <Box use="background" style={{flex: 1, alignItems: 'center'}}>
        <Pressable onPress={openImagePicker}>
          <Center style={styles.photoContainer}>
            {imageUri ? (
              <Image
                source={{uri: imageUri}}
                alt="avartar"
                style={{width: '100%', height: '100%', borderRadius: 100}}
              />
            ) : (
              <Text>Select a photo</Text>
            )}
          </Center>
        </Pressable>
        <VStack style={{flex: 1, width: '100%'}}>
          <HStack
            style={{
              justifyContent: 'space-around',
              width: '100%',
              // backgroundColor: 'yellow',
            }}>
            <VStack>
              <Text style={styles.attributeName}>First Name</Text>
              <Input style={styles.inputSmallBox}>
                <InputField
                  placeholder=""
                  type="text"
                  style={{fontSize: 20}}
                  onChangeText={setFirstName}
                />
              </Input>
            </VStack>
            <VStack>
              <Text style={styles.attributeName}>Last Name</Text>
              <Input
                style={{
                  borderRadius: 10,
                  width: 120,
                  backgroundColor: '#D9D9D9',
                }}>
                <InputField
                  placeholder=""
                  type="text"
                  style={{fontSize: 20}}
                  onChangeText={setLastName}
                />
              </Input>
            </VStack>
          </HStack>
          <HStack
            style={{
              justifyContent: 'space-around',
              width: '100%',
              // backgroundColor: 'yellow',
            }}>
            <VStack>
              <Text style={styles.attributeName}>Gender</Text>
              <SelectList
                setSelected={val => setGender(val === 'male' ? 'M' : 'F')}
                placeholder={dataGender[0].value}
                boxStyles={{borderWidth: 0, ...styles.inputSmallBox}}
                search={false}
                data={dataGender}
                save="value"
              />
            </VStack>
            <VStack>
              <Text style={styles.attributeName}>Home of Origin</Text>
              <SelectList
                setSelected={val => setOrigin(val)}
                placeholder={dataOrigin[0].value}
                boxStyles={{borderWidth: 0, ...styles.inputSmallBox}}
                search={false}
                data={dataOrigin}
                save="value"
              />
            </VStack>
          </HStack>
          <VStack style={{paddingHorizontal: 40}}>
            <Text style={styles.attributeName}>Full-time</Text>
            <SelectList
              setSelected={val => setFullTime(val == 'Yes')}
              placeholder={dataFullTime[0].value}
              boxStyles={{borderWidth: 0, ...styles.inputBigBox}}
              search={false}
              data={dataFullTime}
              save="value"
            />
          </VStack>
          <VStack style={{paddingHorizontal: 40}}>
            <Text style={styles.attributeName}>Major</Text>
            <SelectList
              setSelected={val => setMajor(val)}
              placeholder={dataMajor[0].value}
              boxStyles={{borderWidth: 0, ...styles.inputBigBox}}
              search={false}
              data={dataMajor}
              save="value"
            />
          </VStack>

          <VStack style={{paddingHorizontal: 40}}>
            <Text style={styles.attributeName}>Year of Study</Text>
            <SelectList
              setSelected={val => setYear(val)}
              placeholder={dataYear[0].value}
              boxStyles={{borderWidth: 0, ...styles.inputBigBox}}
              search={false}
              data={dataYear}
              save="value"
            />

            <DebouncedWaitingButton
              mt={30}
              mb={20}
              disabled={!firstname || !lastname || !imageUri}
              opacity={!firstname || !lastname || !imageUri ? 0.4 : 1}
              onPress={async () => {
                const updateIndoPromise = updateInfo.mutateAsync({
                  name: firstname + ' ' + lastname,
                  isFullTime,
                  gender,
                  nationality: origin,
                  major,
                  year,
                });

                const uploadImagePromise = request(
                  requestURL.profilePic,
                  {image: formData, type: mime.getType(imageUri)},
                  {method: 'patch'},
                );
                try {
                  const result = await Promise.all([
                    uploadImagePromise,
                    updateIndoPromise,
                  ]);
                  dispatch(update());
                } catch (e) {
                  console.log('sign up failed');
                }
              }}
              text="Sign Up"
            />
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 100,
    marginTop: '10%',
    // overflow: 'hidden',
    width: 150,
    height: 150,
  },
  attributeName: {
    marginVertical: 15,
  },

  inputSmallBox: {
    borderRadius: 10,
    width: 120,
    height: 50,
    backgroundColor: '#D9D9D9',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  inputBigBox: {
    borderRadius: 10,
    width: '100%',
    height: 50,
    backgroundColor: '#D9D9D9',
    // justifyContent: 'center',
    alignItems: 'center',
  },
});
