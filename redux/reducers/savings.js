import { createSlice } from '@reduxjs/toolkit';

const savingsSlice = createSlice({
  name: 'savings',

  initialState: {
    savings: {
      2023: {},
    },
  },

  reducers: {
    setSavings: (state, action) => ({
      ...state,
      savings: action.payload.savings,
    }),
  },
});

export const setSavings = savingsSlice.actions.setSavings;

export default savingsSlice.reducer;
