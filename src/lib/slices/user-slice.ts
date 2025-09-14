import { User, UserEmail, UserPhone } from '@/lib/types/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  user: User | null;
  phones: UserPhone[];
  emails: UserEmail[];
};

const initialState: UserState = {
  user: null,
  phones: [],
  emails: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setPhones: (state, action: PayloadAction<UserPhone[]>) => {
      state.phones = action.payload;
    },
    clearPhones: (state) => {
      state.phones = [];
    },
    setEmails: (state, action: PayloadAction<UserEmail[]>) => {
      state.emails = action.payload;
    },
    clearEmails: (state) => {
      state.emails = [];
    },
    resetUserState: () => {
      return initialState;
    },
  },
});

export const { setUser, clearUser, setPhones, clearPhones, setEmails, clearEmails, resetUserState } = userSlice.actions;

export default userSlice.reducer;

// Seletores
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectPhones = (state: { user: UserState }) => state.user.phones;
export const selectEmails = (state: { user: UserState }) => state.user.emails;
