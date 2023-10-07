import { createSlice } from '@reduxjs/toolkit';

const incomesSlice = createSlice({
  name: 'incomes',

  initialState: {
    incomes: {
      2023: {},
    },
  },

  reducers: {
    setIncomes: (state, action) => ({
      ...state,
      incomes: action.payload.incomes,
    }),
  },
});

export const setIncomes = incomesSlice.actions.setIncomes;

export default incomesSlice.reducer;
