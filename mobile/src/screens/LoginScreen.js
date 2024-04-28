import {View, Text} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  Heading,
  InputField,
  VStack,
  Input,
  HStack,
} from '@gluestack-ui/themed';
import React from 'react';
import {ROUTES} from '../navigator/constant';
import {useState} from 'react';
import Icons from '../components/Icons';
import {useLoginMutation} from '../utils/query/customHook';
import DebouncedWaitingButton from '../components/DebouncedWaitingButton';
export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const sendLogin = useLoginMutation();
  const handleLogin = async () => {
    try {
      await sendLogin.mutateAsync({email, password});
      // navigation.navigate(ROUTES.SETTINGS);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box
      use="background"
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Box
        style={{
          height: '80%',
          width: '85%',
          padding: 10,
          alignItems: 'center',
        }}>
        <Icons />
        {/* <Heading bold={true} size="3xl">
          Team Up now!
        </Heading> */}
        <Text style={{color: 'black', fontSize: 30}}> Team Up now!</Text>

        <VStack style={{width: '95%'}} mt={30} space={50}>
          <Box mb={10}>
            <FormControl>
              <Input style={{backgroundColor: 'white', borderRadius: 10}}>
                <InputField
                  placeholder="University Email"
                  type="text"
                  style={{fontSize: 20}}
                  onChangeText={setEmail}
                />
              </Input>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <Input
                variant="rounded"
                style={{backgroundColor: 'white', borderRadius: 10}}>
                <InputField
                  placeholder="Password"
                  type="password"
                  style={{fontSize: 20}}
                  onChangeText={setPassword}
                />
              </Input>
            </FormControl>
          </Box>

          {/* <Button   mt={40} mb={20}>
        <ButtonText fontSize='$xl'>Login</ButtonText>
       </Button> */}
          <DebouncedWaitingButton
            mt={40}
            mb={20}
            disabled={!email || !password}
            opacity={!email || !password ? 0.4 : 1}
            onPress={handleLogin}
            text="Login"
          />
          <HStack
            style={{alignItems: 'center', justifyContent: 'space-around'}}>
            <Text>New to TeamUp?</Text>
            <Button
              variant="link"
              onPress={() => navigation.navigate(ROUTES.EMAILVERIFICATION)}>
              <ButtonText>Sign up here</ButtonText>
            </Button>
          </HStack>
          <Button
            variant="link"
            onPress={() =>
              navigation.navigate(ROUTES.EMAILVERIFICATION, {
                type: 'retrievePassword',
              })
            }>
            {/* <ButtonText color="black">Forgot password?</ButtonText> */}
            <Text style={{color: 'black'}}>Forgot password?</Text>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
