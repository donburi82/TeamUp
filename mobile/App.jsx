/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {GluestackUIProvider, Text} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {config} from './config/gluestack-ui.config';

import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {QueryClient, QueryClientProvider} from 'react-query';
import InfoFilling from './src/screens/InfoFilling';
import AuthRouting from './src/navigator/AuthNav.js';
import HomeRouting from './src/navigator/HomeNav';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: error => alert(error.message),
    },
    mutations: {
      onError: error => alert(error.message),
      // onError: error => alert('666'),
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  const userInfo = useSelector(state => state.userInfo);

  const Child = useMemo(() => {
    // return <HomeRouting />;

    if (userInfo.isAuthed) {
      console.log('渲染home捏');
      return <HomeRouting />;
    }
    return <AuthRouting />;
  }, [userInfo]);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <SafeAreaView style={backgroundStyle}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />

            {Child}
          </SafeAreaView>
        </NavigationContainer>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

export default App;
