import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useEffect, useState} from 'react';
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {logOut} from '../utils/reduxStore/reducer';
import {useDispatch} from 'react-redux';
import Alert from './Alert';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import mime from 'mime';
import {useNavigation} from '@react-navigation/native';
import {request, requestURL} from '../utils/query/requestForReactQuery';
import {
  useUpdateProfileMutation,
  useDeleteCourseProjectMutation,
  useDeleteExtracurricularMutation,
  useDeleteCourseStudyMutation,
} from '../utils/query/customHook';
import {showUpdateToast} from '../utils/showToast';
export default function SettingBar({
  text,
  type,
  destination,
  children,
  preferenceId,
  preferenceType,
  disableEdit,
}) {
  const navigation = useNavigation();
  const updateProfile = useUpdateProfileMutation();
  const deleteCP = useDeleteCourseProjectMutation();
  const deleteCS = useDeleteCourseStudyMutation();
  const deleteE = useDeleteExtracurricularMutation();
  const [imageUri, setImage] = useState(null);
  const [formData, setFormData] = React.useState(null);
  useEffect(() => {
    if (formData) {
      console.log('here the image type is ', mime.getType(imageUri));
      updateProfile
        .mutateAsync({image: formData, type: mime.getType(imageUri)})
        .then(() => {
          showUpdateToast();
          // setSelectedImage(imageUri);
        });
    }
  }, [imageUri, formData]);
  if (type === 'signOut') {
    const [alertOpen, setAlertOpen] = useState(false);
    const dispatch = useDispatch();

    return (
      <TouchableOpacity
        style={styles.barContainer}
        onPress={() => {
          setAlertOpen(true);
        }}>
        <View style={{flex: 1}}>
          <Alert
            open={alertOpen}
            setOpen={setAlertOpen}
            handleCancel={() => {
              setAlertOpen(false);
            }}
            handleConfirm={() => {
              dispatch(logOut());
            }}
          />
          <Text style={{...styles.textStyle, color: 'red'}}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  if (type === 'groupPreference') {
    return (
      <TouchableOpacity style={styles.barContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.textStyle}>{text}</Text>
          <TouchableOpacity
            onPress={() => {
              if (preferenceType === 'CourseStudy') {
                deleteCS.mutateAsync(preferenceId);
              } else if (preferenceType === 'CourseProject') {
                deleteCP.mutateAsync(preferenceId);
              } else {
                deleteE.mutateAsync(preferenceId);
              }
            }}>
            <EntypoIcon name="circle-with-cross" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  if (type === 'basicInfo') {
    const openImagePicker = () => {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.4,
        maxHeight: 200,
        maxWidth: 200,
      };

      launchImageLibrary(options).then(async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          let imageUri = response.uri || response.assets?.[0]?.uri;

          const base64Image = await RNFS.readFile(imageUri, 'base64');
          setImage(imageUri);
          setFormData(base64Image);
        }
      });
    };
    return !disableEdit ? (
      <TouchableOpacity
        style={styles.barContainer}
        onPress={() => {
          React.Children.forEach(children, child => {
            if (child.type === Text) {
              navigation.navigate(destination);
            }
            if (child.type === Image) {
              console.log('this is Image');
              openImagePicker();
            }
          });
        }}>
        <View style={styles.innerContainer}>
          <Text style={styles.textStyle}>{text}</Text>
          <View style={styles.rightPart}>
            {children}
            <AntIcon name="right" size={20} />
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View style={styles.barContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.textStyle}>{text}</Text>
          <View style={styles.rightPart}>{children}</View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.barContainer}
      onPress={() => {
        navigation.navigate(destination);
      }}>
      <View style={styles.innerContainer}>
        <Text style={styles.textStyle}>{text}</Text>
        <AntIcon name="right" size={20} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    width: '100%',
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  innerContainer: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    // alignSelf: '',
    color: 'black',
    fontSize: 20,
  },
  rightPart: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 30,
    flex: 1,
    alignItems: 'center',
  },
});
