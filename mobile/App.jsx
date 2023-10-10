/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {  GluestackUIProvider, Text } from "@gluestack-ui/themed"
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
    <GluestackUIProvider config={config}>
    <SafeAreaView style={backgroundStyle} >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
     <LoginScreen />
    </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
