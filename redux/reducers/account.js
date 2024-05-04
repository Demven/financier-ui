import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',

  initialState: {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    language: 'en',
    currencyType: 'USD',
    currencySymbol: '$',
  },

  reducers: {
    setAccount: (state, action) => ({
      ...state,
      ...action.payload,
    }),
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

export const setAccountAction = accountSlice.actions.setAccount;
export const setFirstNameAction = accountSlice.actions.setFirstName;
export const setLastNameAction = accountSlice.actions.setLastName;
export const setEmailAction = accountSlice.actions.setEmail;
export const setLanguageAction = accountSlice.actions.setLanguage;
export const setCurrencyTypeAction = accountSlice.actions.setCurrencyType;
export const setCurrencySymbolAction = accountSlice.actions.setCurrencySymbol;

export default accountSlice.reducer;
