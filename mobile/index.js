/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {persistor, store} from './src/utils/reduxStore/index.js';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const WrapApp = () => (
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <App />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
    <Toast />
  </>
);

AppRegistry.registerComponent(appName, () => WrapApp);
