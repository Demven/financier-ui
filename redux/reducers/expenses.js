import { createSlice } from '@reduxjs/toolkit';
import { getWeekNumberByDayNumber } from '../../services/date';

const expensesSlice = createSlice({
  name: 'expenses',

  initialState: {
    expenses: {},
    expensesTotals: {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    },
  },

  reducers: {
    setExpenses: (state, action) => {
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

      // TODO: POST to API
      // saveToStorage(STORAGE_KEY.EXPENSES, updatedExpenses);

      return {
        ...state,
        expenses: updatedExpenses,
      };
    },
    updateExpense: (state, action) => {
      const {
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        expense,
      } = action.payload;
      const [newYear, newMonth, newDay] = expense.dateString.split('-').map(string => Number(string));
      let newWeek = getWeekNumberByDayNumber(newDay);

      const updatedExpenses = {
        ...state.expenses,
        [oldYear]: {
          ...(state.expenses?.[oldYear] || {}),
          [oldMonth]: {
            ...(state.expenses?.[oldYear]?.[oldMonth] || {}),
            [oldWeek]: (state.expenses?.[oldYear]?.[oldMonth]?.[oldWeek] || [])
              .filter(expenseItem => expenseItem.id !== expense.id),
          },
        },
      };
      updatedExpenses[newYear] = {
        ...(updatedExpenses?.[newYear] || {}),
        [newMonth]: {
          ...(updatedExpenses?.[newYear]?.[newMonth] || {}),
          [newWeek]: [
            ...(updatedExpenses?.[newYear]?.[newMonth]?.[newWeek] || []),
            expense,
          ].sort((expense1, expense2) => {
            const date1 = +(new Date(expense1.dateString));
            const date2 = +(new Date(expense2.dateString));

            return date1 - date2; // asc
          }),
        },
      };

      // TODO: POST to API
      // saveToStorage(STORAGE_KEY.EXPENSES, updatedExpenses);

      return {
        ...state,
        expenses: updatedExpenses,
      };
    },
    setExpensesTotals: (state, action) => {
      return {
        ...state,
        expensesTotals: action.payload,
      };
    },
  },
});

export const setExpensesAction = expensesSlice.actions.setExpenses;
export const addExpenseAction = expensesSlice.actions.addExpense;
export const updateExpenseAction = expensesSlice.actions.updateExpense;
export const setExpensesTotalsAction = expensesSlice.actions.setExpensesTotals;

export default expensesSlice.reducer;
