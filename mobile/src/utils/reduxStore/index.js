import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalReducer from './reducer';

import logger, {createLogger} from 'redux-logger';

const customLoggerMiddleware = createLogger({
  // Define custom logger options here
  stateTransformer: state => {
    // Exclude the 'someAttribute' from state
    const {userInfo} = state;
    return {...userInfo, imageUri: 'too long i ignore it'};
  },
  actionTransformer: action => {
    // Exclude a specific attribute from the action object
    if (action.type === 'global/updateImageUri') {
      return {imageUri: 'too long i ignore it'};
    }
    return action;
  },
});
const persistConfig = {
  key: 'global',
  storage: AsyncStorage,
  // whitelist: ['global'],
};

const persistedReducer = persistReducer(persistConfig, globalReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(
      customLoggerMiddleware,
    ),
});

// if (process.env.NODE_ENV !== 'production' && module.hot) {
//     module.hot.accept('./reducer', () => store.replaceReducer(rootReducer));
//   }

const persistor = persistStore(store);

export {store, persistor};
