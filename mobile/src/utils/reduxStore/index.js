import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalReducer from './reducer';
import logger from 'redux-logger';

const persistConfig = {
  key: 'global',
  storage: AsyncStorage,
  // whitelist: ['global'],
};

const persistedReducer = persistReducer(persistConfig, globalReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(logger),
});

// if (process.env.NODE_ENV !== 'production' && module.hot) {
//     module.hot.accept('./reducer', () => store.replaceReducer(rootReducer));
//   }

const persistor = persistStore(store);

export {store, persistor};
