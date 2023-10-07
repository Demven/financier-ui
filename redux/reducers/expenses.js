import { createSlice } from '@reduxjs/toolkit';

const expensesSlice = createSlice({
  name: 'expenses',

  initialState: {
    expenses: {
      2023: {},
    },
  },

  reducers: {
    setExpenses: (state, action) => ({
      ...state,
      expenses: action.payload.expenses,
    }),
  },
});

export const setExpenses = expensesSlice.actions.setExpenses;

export default expensesSlice.reducer;
