import Toast from 'react-native-toast-message';
export const showUpdateToast = () => {
  Toast.show({
    type: 'success',
    position: 'top',
    topOffset: 0,
    text1: 'Updated',
    visibilityTime: 1000,
    text1Style: {
      fontSize: 20,
    },
    autoHide: true,
  });
};
