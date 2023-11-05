import { View, Text } from 'react-native'
import { Button,ButtonText } from '@gluestack-ui/themed'
import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {login,logOut} from '../utils/reduxStore/reducer'

export default function SetupScreen() {
    const state = useSelector((state)=>state)
    const dispatch=useDispatch()
    console.log(state)
  return (
    <View>
      <Text>isAuthed is {state.userinfo.isAuthed?"登录":"没登录"}  {false}</Text>
      <Button use='login' mt={40} mb={20} onPress={()=>{dispatch(login({payload:"good"}))}}>
        <ButtonText fontSize='$xl'>Login</ButtonText>
       </Button>
        <Button use='login' mt={40} mb={20} onPress={()=>dispatch(logOut())}>
        <ButtonText fontSize='$xl'>Logout</ButtonText>
       </Button>
    </View>
  )
}