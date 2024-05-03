/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {GluestackUIProvider, Text} from '@gluestack-ui/themed';
import {useEffect} from 'react';
import {config} from './config/gluestack-ui.config';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {ROUTES} from './src/navigator/constant';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {QueryClient, QueryClientProvider} from 'react-query';
import InfoFilling from './src/screens/InfoFilling';
import AuthRouting from './src/navigator/AuthNav.js';
import HomeRouting from './src/navigator/HomeNav';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {LogBox} from 'react-native';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: error => alert(error),
    },
    mutations: {
      onError: error => alert(error),
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
  const navigation = useNavigation();
  LogBox.ignoreAllLogs();
  // useEffect(() => {
  //   if (userInfo.isAuthed) {
  //     // Execute navigation reset as a side effect when userInfo changes and is authenticated
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: ROUTES.HOME}],
  //     });
  //   }
  //   // Depend on userInfo to re-trigger this effect only when userInfo changes
  // }, [userInfo, navigation]);

  const Child = useMemo(() => {
    // Determine which component to render based on authentication status,
    // but don't perform navigation here
    if (userInfo.isAuthed) {
      return <HomeRouting key="home" />;
    }
    return <AuthRouting key="auth" />;
  }, [userInfo]);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={config}>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />

          {Child}
        </SafeAreaView>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

export default App;
