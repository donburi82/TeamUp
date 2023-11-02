/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {  GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { NavigationContainer } from '@react-navigation/native';
import { config } from "./gluestack-ui.config.ts"

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import LoginScreen from './src/screens/LoginScreen';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex:1,
   
  };

  return (
    <GluestackUIProvider config={config} >
      <NavigationContainer>
    <SafeAreaView style={backgroundStyle} >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
     <LoginScreen />
    </SafeAreaView>
    </NavigationContainer>
    </GluestackUIProvider>
  );
}


export default App;
