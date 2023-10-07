import { createSlice } from '@reduxjs/toolkit';
import settingsData from '../../data/settings.json';

const accountSlice = createSlice({
  name: 'account',

  initialState: {
    firstName: settingsData.firstName,
    lastName: settingsData.lastName,
    email: settingsData.email,
    language: settingsData.language,
    currencyType: settingsData.currencyType,
    currencySymbol: settingsData.currencySymbol,
  },

  reducers: {
    setFirstName: (state, action) => ({
      ...state,
      firstName: action.payload.firstName,
    }),
    setLastName: (state, action) => ({
      ...state,
      lastName: action.payload.lastName,
    }),
    setEmail: (state, action) => ({
      ...state,
      email: action.payload.email,
    }),
    setLanguage: (state, action) => ({
      ...state,
      language: action.payload.language,
    }),
    setCurrencyType: (state, action) => ({
      ...state,
      currencyType: action.payload.currencyType,
    }),
    setCurrencySymbol: (state, action) => ({
      ...state,
      currencySymbol: action.payload.currencySymbol,
    }),
  },
});

export const setFirstName = accountSlice.actions.setFirstName;
export const setLastName = accountSlice.actions.setLastName;
export const setEmail = accountSlice.actions.setEmail;
export const setLanguage = accountSlice.actions.setLanguage;
export const setCurrencyType = accountSlice.actions.setCurrencyType;
export const setCurrencySymbol = accountSlice.actions.setCurrencySymbol;

export default accountSlice.reducer;
