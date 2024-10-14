import { createSlice } from '@reduxjs/toolkit';
import { getWeekNumberByDayNumber } from '../../services/date';
import { sortItemsByDateAsc } from '../../services/dataItems';

const INITIAL_STATE = {
  incomes: {},
  incomesTotals: {
    total: 0,
    yearAverage: 0,
    monthAverage: 0,
    weekAverage: 0,
  },
};

const incomesSlice = createSlice({
  name: 'incomes',

  initialState: INITIAL_STATE,

  reducers: {
    resetIncomesAndIncomesTotals: () => INITIAL_STATE,

    setIncomes: (state, action) => {
      return {
        ...state,
        incomes: action.payload,
      };
    },

    addIncomesGroupedByYearMonthWeek: (state, action) => {
      return {
        ...state,
        incomes: {
          ...state.incomes,
          ...action.payload,
        },
      };
    },

    addIncome: (state, action) => {
      const { year, month, week, income } = action.payload;

      const updatedIncomes = {
        ...state.incomes,
        [year]: {
          ...(state.incomes?.[year] || {}),
          [month]: {
            ...(state.incomes?.[year]?.[month] || {}),
            [week]: [
              ...(state.incomes?.[year]?.[month]?.[week] || []),
              income,
            ],
          },
        },
      };

      return {
        ...state,
        incomes: updatedIncomes,
      };
    },

    updateIncome: (state, action) => {
      const {
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        income,
      } = action.payload;
      const [newYear, newMonth, newDay] = income.dateString.split('-').map(string => Number(string));
      let newWeek = getWeekNumberByDayNumber(newDay);

      const updatedIncomes = {
        ...state.incomes,
        [oldYear]: {
          ...(state.incomes?.[oldYear] || {}),
          [oldMonth]: {
            ...(state.incomes?.[oldYear]?.[oldMonth] || {}),
            [oldWeek]: (state.incomes?.[oldYear]?.[oldMonth]?.[oldWeek] || [])
              .filter(incomeItem => incomeItem.id !== income.id),
          },
        },
      };

      updatedIncomes[newYear] = {
        ...(updatedIncomes?.[newYear] || {}),
        [newMonth]: {
          ...(updatedIncomes?.[newYear]?.[newMonth] || {}),
          [newWeek]: sortItemsByDateAsc([
            ...(updatedIncomes?.[newYear]?.[newMonth]?.[newWeek] || []),
            income,
          ]),
        },
      };

      return {
        ...state,
        incomes: updatedIncomes,
      };
    },

    deleteIncome: (state, action) => {
      const { year, month, week, income } = action.payload;

      const updatedIncomes = {
        ...state.incomes,
        [year]: {
          ...(state.incomes?.[year] || {}),
          [month]: {
            ...(state.incomes?.[year]?.[month] || {}),
            [week]: [
              ...(state.incomes?.[year]?.[month]?.[week] || [])
                .filter(weekIncome => weekIncome.id !== income.id),
            ],
          },
        },
      };

      // after deletion, a week/month/year nodes can remain empty, so we need to clean up
      // delete empty week
      if (!updatedIncomes[year][month][week].length) {
        delete updatedIncomes[year][month][week];
      }

      // delete empty month
      if (!Object.keys(updatedIncomes[year][month]).length) {
        delete updatedIncomes[year][month];
      }

      // delete empty year
      if (!Object.keys(updatedIncomes[year]).length) {
        delete updatedIncomes[year];
      }

      return {
        ...state,
        incomes: updatedIncomes,
      };
    },

    setIncomesTotals: (state, action) => {
      return {
        ...state,
        incomesTotals: action.payload,
      };
    },
    addYearIncomesTotals: (state, action) => {
      return {
        ...state,
        incomesTotals: {
          ...state.incomesTotals,
          ...action.payload,
        },
      };
    },
  },
});

export const resetIncomesAndIncomesTotalsAction = incomesSlice.actions.resetIncomesAndIncomesTotals;
export const setIncomesAction = incomesSlice.actions.setIncomes;
export const addIncomesGroupedByYearMonthWeekAction = incomesSlice.actions.addIncomesGroupedByYearMonthWeek;
export const addIncomeAction = incomesSlice.actions.addIncome;
export const updateIncomeAction = incomesSlice.actions.updateIncome;
export const deleteIncomeAction = incomesSlice.actions.deleteIncome;

export const setIncomesTotalsAction = incomesSlice.actions.setIncomesTotals;
export const addYearIncomesTotalsAction = incomesSlice.actions.addYearIncomesTotals;

export default incomesSlice.reducer;
