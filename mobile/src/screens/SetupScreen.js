import { Platform, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Image,Alert } from 'react-native'
import { Box, Button, ButtonText, FormControl, Heading, InputField, VStack ,Input, HStack,KeyboardAvoidingView, ScrollView} from '@gluestack-ui/themed'
import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useSendVerificationEmailMutation } from '../utils/query/customHook'
import {login,logOut} from '../utils/reduxStore/reducer'
import { useState,useEffect } from 'react'
import Icons from '../components/Icons'

export default function SetupScreen({navigation}) {
    // const state = useSelector((state)=>state)
    const dispatch=useDispatch()
    const [email, setEmail] = useState('');
    // console.log(state)
    const sendEmail = useSendVerificationEmailMutation()

  const [veriCode, setVeriCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const [token, setToken] = useState(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [veriCounter, setVeriCounter] = useState(0);
  useEffect(()=>{
   
let timer=null
if(veriCounter>0){
  timer = setTimeout(() => {
    setVeriCounter((prev) => prev - 1);
  }, 1000);

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
}
  },[veriCounter])
    const sendEmailOnPress=()=>{
      if (!isDebouncing) {
        setIsDebouncing(true);
        sendEmail.mutateAsync(email+"@connect.ust.hk").then((status)=>{
          console.log("sendEmail success",status)
          setVeriCounter(60);
          Alert.alert(
            'Email has been sent',
            `Email has been sent to ${email}@connect.ust.hk, please take a look at junk also`,
            [
              {
                text: 'OK',
                
              },
            ],
          );
          
        },(err)=>{
          console.log("there is err in sending email",err)
        })
  
        // 设置定时器来重置防抖状态
        setTimeout(() => {
          setIsDebouncing(false);
        }, 3000); 
      
    }
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
      
    <Icons /> 
      <Heading bold={true} size="2xl">Team Up now!</Heading>
     
      <VStack style={{width:"95%"} } mt={20} space={50}>
      <Text>Verify your University Email</Text>
        <Box  mt={20} mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}    >
          <InputField placeholder='University Email' type="text" style={{fontSize:20}}  onChangeText={setEmail}/>
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
          <InputField  type="suffix" style={{fontSize:20}}  keyboardType="numeric"  onChangeText={setVeriCode} />
          </Input>
          <Button   action='primary' style={{flex:1}} onPress={sendEmailOnPress}
          disabled={!email ||  veriCounter > 0}
          opacity={!email || veriCounter > 0 ? 0.4 : 1}
          >
        <ButtonText fontSize='$xl'>{`${veriCounter > 0 ? `(${veriCounter}s)` : 'Verify'}`}</ButtonText>
       </Button>
       </HStack>
       
       <Box  mt={10} mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}   >
          <InputField placeholder='password' type="text" style={{fontSize:20}} onChangeText={setPassword}/>
          </Input>
        
        </FormControl>
        </Box>
        <Box   mb={10}>
        <FormControl >
          <Input  style={{backgroundColor:"white",borderRadius:10}}    >
          <InputField placeholder='password again' type="text" style={{fontSize:20}} onChangeText={setPasswordAgain}/>
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