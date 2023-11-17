
import { Box,Image } from "@gluestack-ui/themed";

import React from 'react'

export default function Icons() {
  return (
    <Box  style={{height:100,width:100,borderRadius:40,backgroundColor:"white", overflow:'hidden',justifyContent:'center',alignItems:'center'
  }}>
      <Image
 style={{height:150,width:150}}
 alt="a icon image"
  
  source={require('../utils/Icon.png')}
/>
      </Box>
  )
}