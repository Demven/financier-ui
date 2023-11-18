import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';

const expensesSlice = createSlice({
  name: 'expenses',

  initialState: {
    expenses: {
      [2023]: {
        [1]: { // month
          [1]: { // week
            [1]: [], // day
            [2]: [],
            [3]: [],
            [4]: [],
            [5]: [],
            [6]: [],
            [7]: [],
          },
          [2]: {},
          [3]: {},
          [4]: {},
        },
      },
    },
  },

  reducers: {
    setExpenses: (state, action) => {
      saveToStorage(STORAGE_KEY.EXPENSES, action.payload);

      return {
        ...state,
        expenses: action.payload,
      };
    },
    addExpense: (state, action) => {
      const { year, month, week, day, expense } = action.payload;

      const updatedExpenses = {
        ...state.expenses,
        [year]: {
          ...(state.expenses?.[year] || {}),
          [month]: {
            ...(state.expenses?.[year]?.[month] || {}),
            [week]: {
              ...(state.expenses?.[year]?.[month]?.[week] || {}),
              [day]: [
                ...(state.expenses?.[year]?.[month]?.[week]?.[day] || []),
                expense,
              ],
            },
          },
        },
      };

      saveToStorage(STORAGE_KEY.EXPENSES, updatedExpenses);

      return {
        ...state,
        expenses: updatedExpenses,
      };
    },
  },
});

export const setExpensesAction = expensesSlice.actions.setExpenses;
export const addExpenseAction = expensesSlice.actions.addExpense;

export default expensesSlice.reducer;
