import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Input, InputField} from '@gluestack-ui/themed';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
import {useUpdatePasswordMutation} from '../utils/query/customHook';
export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const updatePassword = useUpdatePasswordMutation();
  const handleUpdate = async () => {
    try {
      await updatePassword.mutateAsync({oldPassword, newPassword});
      // navigation.navigate(ROUTES.SETTINGS);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.oneLine}>
        <AntIcon name="key" size={30} />
        <Input
          variant="rounded"
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            flex: 1,
            marginLeft: 10,
          }}>
          <InputField
            placeholder="Old Password"
            type="password"
            style={{fontSize: 20}}
            onChangeText={setOldPassword}
          />
        </Input>
      </View>
      <View style={styles.oneLine}>
        <AntIcon name="key" size={30} />
        <Input
          variant="rounded"
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            flex: 1,
            marginLeft: 10,
          }}>
          <InputField
            placeholder="New Password"
            type="password"
            style={{fontSize: 20}}
            onChangeText={setNewPassword}
          />
        </Input>
      </View>

      <DebouncedWaitingButton
        mt={20}
        mb={20}
        style={{marginLeft: 20, marginRight: 20}}
        disabled={!oldPassword || !oldPassword}
        opacity={!oldPassword || !oldPassword ? 0.4 : 1}
        onPress={handleUpdate}
        text="Confirm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  oneLine: {
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
});
