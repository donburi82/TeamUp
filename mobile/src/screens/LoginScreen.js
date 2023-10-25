import { View, Text } from 'react-native'
import { Box, Button, ButtonText, FormControl, Heading, InputField, VStack ,Input, HStack} from '@gluestack-ui/themed'
import React from 'react'

export default function LoginScreen() {
  return (
    <Box use="background" style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        
    <Box style={{height:'75%',width:'85%',padding:10,alignItems:"center"}}>
      <Heading bold={true} size="3xl">Team Up </Heading>
      <Heading bold={true} size="3xl" >now!</Heading>
      <VStack style={{width:"95%"} } mt={30} space={50}>
        <Box  mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}} hardShadow='5' h={50}>
          <InputField placeholder='University Email' type="text" />
          </Input>
        
        </FormControl>
        </Box>
       <Box >
       <FormControl>
        <Input variant='rounded' style={{backgroundColor:"white",borderRadius:10}} hardShadow='5'h={50}>
          <InputField placeholder='Password' type="password"/>
          </Input>
         
        </FormControl>
       </Box>
       
       <Button use='login' mt={40} mb={20}>
        <ButtonText fontSize='$xl'>Login</ButtonText>
       </Button>
       <HStack style={{alignItems:'center',justifyContent:'space-around'}}>
        <Text >New to TeamUp?</Text>
        <Button variant='link'>
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