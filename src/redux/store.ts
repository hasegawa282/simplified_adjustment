import {
  combineReducers,
  configureStore,
  // getDefaultMiddleware
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// slices
import systemSlice from './slices/systemSlice';

// (ここにslicesを追加)

const rootReducer = combineReducers({
  system: systemSlice.reducer,
  // (ここにreducerを追加)
});

const setupStore = () => {
  // let middlewares = getDefaultMiddleware({
  //   serializableCheck: false,
  // });
  let middlewares = [thunk, logger];
  if (process.env.NODE_ENV === 'production') {
    middlewares = [thunk]; // 本番環境ではloggerは表示しない
  }

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: [], // 永続化したいstateを追加
    // blacklist: []
  };

  const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: middlewares,
  });
  return store;
};

export const store = setupStore();
export const persistor = persistStore(store);
