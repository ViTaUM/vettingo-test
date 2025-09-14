import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/user-slice';

export const makeStore = () =>
  configureStore({
    reducer: combineReducers({
      user: userSlice,
    }),
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        serializableCheck: true,
        immutableCheck: true,
      });
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
