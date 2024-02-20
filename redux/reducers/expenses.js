import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import expensesData from '../../data/expenses';
import expensesTotalData from '../../data/expensesTotal';

const expensesSlice = createSlice({
  name: 'expenses',

  initialState: {
    expenses: expensesData,
    expensesTotal: expensesTotalData,
    yearAverage: expensesTotalData.yearAverage,
    monthAverage: expensesTotalData.monthAverage,
    weekAverage: expensesTotalData.weekAverage,
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
      const { year, month, week, expense } = action.payload;

      const updatedExpenses = {
        ...state.expenses,
        [year]: {
          ...(state.expenses?.[year] || {}),
          [month]: {
            ...(state.expenses?.[year]?.[month] || {}),
            [week]: [
              ...(state.expenses?.[year]?.[month]?.[week] || []),
              expense,
            ],
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
