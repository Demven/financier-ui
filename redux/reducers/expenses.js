import { createSlice } from '@reduxjs/toolkit';
import { getWeekNumberByDayNumber } from '../../services/date';
import { sortItemsByDateAsc } from '../../services/dataItems';

const INITIAL_STATE = {
  expenses: {},
  expensesTotals: {
    total: 0,
    yearAverage: 0,
    monthAverage: 0,
    weekAverage: 0,
  },
};

const expensesSlice = createSlice({
  name: 'expenses',

  initialState: INITIAL_STATE,

  reducers: {
    resetExpenses: () => INITIAL_STATE,

    setExpenses: (state, action) => {
      return {
        ...state,
        expenses: action.payload,
      };
    },
    addExpensesGroupedByYearMonthWeek: (state, action) => {
      return {
        ...state,
        expenses: {
          ...state.expenses,
          ...action.payload,
        },
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
          [newWeek]: sortItemsByDateAsc([
            ...(updatedExpenses?.[newYear]?.[newMonth]?.[newWeek] || []),
            expense,
          ]),
        },
      };

      return {
        ...state,
        expenses: updatedExpenses,
      };
    },
    deleteExpense: (state, action) => {
      const { year, month, week, expense } = action.payload;

      const updatedExpenses = {
        ...state.expenses,
        [year]: {
          ...(state.expenses?.[year] || {}),
          [month]: {
            ...(state.expenses?.[year]?.[month] || {}),
            [week]: [
              ...(state.expenses?.[year]?.[month]?.[week] || [])
                .filter(weekExpense => weekExpense.id !== expense.id),
            ],
          },
        },
      };

      // after deletion, a week/month/year nodes can remain empty, so we need to clean up
      // delete empty week
      if (!updatedExpenses[year][month][week].length) {
        delete updatedExpenses[year][month][week];
      }

      // delete empty month
      if (!Object.keys(updatedExpenses[year][month]).length) {
        delete updatedExpenses[year][month];
      }

      // delete empty year
      if (!Object.keys(updatedExpenses[year]).length) {
        delete updatedExpenses[year];
      }

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
    addYearExpensesTotals: (state, action) => {
      return {
        ...state,
        expensesTotals: {
          ...state.expensesTotals,
          ...action.payload,
        },
      };
    },
  },
});

export const resetExpensesAction = expensesSlice.actions.resetExpenses;

export const setExpensesAction = expensesSlice.actions.setExpenses;
export const addExpensesGroupedByYearMonthWeekAction = expensesSlice.actions.addExpensesGroupedByYearMonthWeek;
export const addExpenseAction = expensesSlice.actions.addExpense;
export const updateExpenseAction = expensesSlice.actions.updateExpense;
export const deleteExpenseAction = expensesSlice.actions.deleteExpense;

export const setExpensesTotalsAction = expensesSlice.actions.setExpensesTotals;
export const addYearExpensesTotalsAction = expensesSlice.actions.addYearExpensesTotals;

export default expensesSlice.reducer;
