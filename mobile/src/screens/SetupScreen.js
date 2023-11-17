import { Platform, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Box, Button, ButtonText, FormControl, Heading, InputField, VStack ,Input, HStack,KeyboardAvoidingView, ScrollView} from '@gluestack-ui/themed'
import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useSendVerificationEmailMutation } from '../utils/query/customHook'
import {login,logOut} from '../utils/reduxStore/reducer'
import { useState } from 'react'

export default function SetupScreen() {
    // const state = useSelector((state)=>state)
    const dispatch=useDispatch()
    const [email, setEmail] = useState('xmu');
    // console.log(state)
    const sendEmail = useSendVerificationEmailMutation()
    const sendEmailOnPress=()=>{
      sendEmail.mutateAsync(email+"@connect.ust.hk").then((status)=>{
        console.log("status returned is ",status)
      },(err)=>{
        console.log("there is err",err)
      })
    }
  return (
    
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={20}
    >
      <ScrollView  style={{ flex: 1,position:"relative" }}>
    <Box  style={{flex:1,alignItems:'center',justifyContent:'center'}}>
       
    <Box  h="90%" width="85%" style={{padding:10,alignItems:"center"}}>
      <Heading bold={true} size="3xl">Team Up </Heading>
      <Heading bold={true} size="3xl" >now!</Heading>
      <VStack style={{width:"95%"} } mt={20} space={50}>
      <Text>Verify your University Email</Text>
        <Box  mt={20} mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}    >
          <InputField placeholder='University Email' type="text" style={{fontSize:20}} />
          </Input>
        
        </FormControl>
        </Box>
       <Box >
       <FormControl>
        <Input variant='rounded' style={{backgroundColor:"white",borderRadius:10}}   isReadOnly>
          <InputField placeholder='@connect.ust.hk' type="suffix" style={{fontSize:20}}/>
          </Input>
         
        </FormControl>
       </Box>
       <HStack mt={10} style={{alignItems:'top'}}>
       <Input variant='rounded' style={{backgroundColor:"white",borderRadius:10 ,flex:2}}    mr={10} >
          <InputField  type="suffix" style={{fontSize:20}}  keyboardType="numeric" />
          </Input>
          <Button   action='primary' style={{flex:1}} onPress={sendEmailOnPress}>
        <ButtonText fontSize='$xl'>Verify</ButtonText>
       </Button>
       </HStack>
       
       <Box  mt={10} mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}   >
          <InputField placeholder='password' type="text" style={{fontSize:20}} />
          </Input>
        
        </FormControl>
        </Box>
        <Box   mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}    >
          <InputField placeholder='password again' type="text" style={{fontSize:20}} />
          </Input>
        
        </FormControl>
        </Box>
        <Button   mt={20} mb={20}>
        <ButtonText fontSize='$xl'>Proceed</ButtonText>
       </Button>
      </VStack>
    </Box>
    
   
 
  
    </Box>
    <Box style={{height:Platform.OS=="ios"?0:50}}/>
    </ScrollView>
    <Box style={{position:'absolute',bottom:10,alignItems:"center",width:"100%"}}>
     <Text >Please remember your credentials.</Text>
     </Box>
    
    </KeyboardAvoidingView>
     

     
    
  )
}