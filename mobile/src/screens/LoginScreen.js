import { View, Text } from 'react-native'
import { Box, Button, ButtonText, FormControl, Heading, InputField, VStack ,Input, HStack} from '@gluestack-ui/themed'
import React from 'react'
import { ROUTES } from '../navigator/constant'
import Icons from '../components/Icons'
export default function LoginScreen({navigation}) {
  return (
    <Box use="background" style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        
    <Box style={{height:'80%',width:'85%',padding:10,alignItems:"center"}}>
      <Icons />
      <Heading bold={true} size="3xl">Team Up now!</Heading>
    
      <VStack style={{width:"95%"} } mt={30} space={50}>
        <Box  mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}  >
          <InputField placeholder='University Email' type="text" style={{fontSize:20}}/>
          </Input>
        
        </FormControl>
        </Box>
       <Box >
       <FormControl>
        <Input variant='rounded' style={{backgroundColor:"white",borderRadius:10}}  >
          <InputField placeholder='Password' type="password" style={{fontSize:20}}/>
          </Input>
         
        </FormControl>
       </Box>
       
       <Button   mt={40} mb={20}>
        <ButtonText fontSize='$xl'>Login</ButtonText>
       </Button>
       <HStack style={{alignItems:'center',justifyContent:'space-around'}}>
        <Text >New to TeamUp?</Text>
        <Button variant='link' onPress={()=>navigation.navigate(ROUTES.EMAILVERIFICATION)}>
          <ButtonText>Sign up here</ButtonText>
        </Button>
       </HStack>
       <Button variant='link'>
          <ButtonText color='black' >Forgot password?</ButtonText>
        </Button>
      </VStack>
    </Box>
    </Box>
  )
}