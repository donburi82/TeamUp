import {View, Text} from 'react-native';
import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function Alert({
  header,
  content,
  open,
  setOpen,
  handleCancel,
  handleConfirm,
  confirmText,
}) {
  return (
    <AwesomeAlert
      show={open}
      showProgress={false}
      title="Alert"
      message="Do you really want to log out"
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="No, cancel"
      confirmText={confirmText || 'Yes, log out'}
      confirmButtonColor="#DD6B55"
      onCancelPressed={handleCancel}
      onConfirmPressed={handleConfirm}
    />
  );
}
