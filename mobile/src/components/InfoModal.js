import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {welcome} from '../utils/reduxStore/reducer';
import React, {useState} from 'react';

export default function InfoModal() {
  const {welcomed} = useSelector(state => state.userInfo);
  const [modalVisible, setModalVisible] = useState(welcomed !== true);
  const dispatch = useDispatch();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.textHead}>Welcome to TeamUp</Text>
          <Text style={styles.modalText}>
            To see other users and groups, go to Settings & update your
            preferences.
          </Text>
          <Text style={styles.modalText}>
            Course Project: A project group related to a specific course code
          </Text>
          <Text style={styles.modalText}>
            Course Study: A study group related to a specific course code
          </Text>
          <Text style={styles.modalText}>
            Extracurricular: A project or study group not related to a specific
            course code
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              setModalVisible(!modalVisible);
              dispatch(welcome());
            }}>
            <Text style={styles.textStyle}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: 300,
    // height: 250,
    backgroundColor: 'white',
    // backgroundColor: 'red',
    borderRadius: 40,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 35,
    elevation: 2,
  },
  buttonOpen: {
    // backgroundColor: 'red',
  },
  buttonClose: {
    backgroundColor: 'rgba(63,43,190,0.8)',
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
  },
  textHead: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    fontWeight: '800',
  },
});
