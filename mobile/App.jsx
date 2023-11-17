/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {  GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { NavigationContainer } from '@react-navigation/native';
import { config } from "./config/gluestack-ui.config"



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
 
} from 'react-native/Libraries/NewAppScreen';
import { QueryClient, QueryClientProvider } from 'react-query';
import {persistor,store} from './src/utils/reduxStore/index.js'
import {Provider} from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react';
import AuthRouting from './src/navigator/AuthNav.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => alert(error.message),
    },
    mutations: {
      onError: (error) => alert(error.message),
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex:1,
   
  };

  return (
    <QueryClientProvider client={queryClient}>
    <GluestackUIProvider config={config} >
      <NavigationContainer>
    <SafeAreaView style={backgroundStyle} >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} >

      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
 
  
     <AuthRouting />
        </PersistGate>
        </Provider>
    </SafeAreaView>
    </NavigationContainer>
    </GluestackUIProvider>
    </QueryClientProvider>
  );
}


export default App;
