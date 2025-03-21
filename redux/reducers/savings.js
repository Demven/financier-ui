import { createSlice } from '@reduxjs/toolkit';
import { getWeekNumberByDayNumber } from '../../services/date';
import { sortItemsByDateAsc } from '../../services/dataItems';

const INITIAL_STATE = {
  savings: {},
  savingsTotals: {
    total: 0,
    yearAverage: 0,
    monthAverage: 0,
    weekAverage: 0,
  },
  investments: {},
  investmentsTotals: {
    total: 0,
    yearAverage: 0,
    monthAverage: 0,
    weekAverage: 0,
  },
};

const savingsSlice = createSlice({
  name: 'savings',

  initialState: INITIAL_STATE,

  reducers: {
    resetSavingsAndInvestments: () => INITIAL_STATE,

    setSavings: (state, action) => {
      return {
        ...state,
        savings: action.payload,
      };
    },

    addSavingsGroupedByYearMonthWeek: (state, action) => {
      return {
        ...state,
        savings: {
          ...state.savings,
          ...action.payload,
        },
      };
    },

    addSaving: (state, action) => {
      const { year, month, week, saving } = action.payload;

      const updatedSavings = {
        ...state.savings,
        [year]: {
          ...(state.savings?.[year] || {}),
          [month]: {
            ...(state.savings?.[year]?.[month] || {}),
            [week]: [
              ...(state.savings?.[year]?.[month]?.[week] || []),
              saving,
            ],
          },
        },
      };

      return {
        ...state,
        savings: updatedSavings,
      };
    },

    updateSaving: (state, action) => {
      const {
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        saving,
      } = action.payload;
      const [newYear, newMonth, newDay] = saving.dateString.split('-').map(string => Number(string));
      let newWeek = getWeekNumberByDayNumber(newDay);

      const updatedSavings = {
        ...state.savings,
        [oldYear]: {
          ...(state.savings?.[oldYear] || {}),
          [oldMonth]: {
            ...(state.savings?.[oldYear]?.[oldMonth] || {}),
            [oldWeek]: (state.savings?.[oldYear]?.[oldMonth]?.[oldWeek] || [])
              .filter(savingItem => savingItem.id !== saving.id),
          },
        },
      };
      updatedSavings[newYear] = {
        ...(updatedSavings?.[newYear] || {}),
        [newMonth]: {
          ...(updatedSavings?.[newYear]?.[newMonth] || {}),
          [newWeek]: sortItemsByDateAsc([
            ...(updatedSavings?.[newYear]?.[newMonth]?.[newWeek] || []),
            saving,
          ]),
        },
      };

      return {
        ...state,
        savings: updatedSavings,
      };
    },

    deleteSaving: (state, action) => {
      const { year, month, week, saving } = action.payload;

      const updatedSavings = {
        ...state.savings,
        [year]: {
          ...(state.savings?.[year] || {}),
          [month]: {
            ...(state.savings?.[year]?.[month] || {}),
            [week]: [
              ...(state.savings?.[year]?.[month]?.[week] || [])
                .filter(weekSaving => weekSaving.id !== saving.id),
            ],
          },
        },
      };

      // after deletion, a week/month/year nodes can remain empty, so we need to clean up
      // delete empty week
      if (!updatedSavings[year][month][week].length) {
        delete updatedSavings[year][month][week];
      }

      // delete empty month
      if (!Object.keys(updatedSavings[year][month]).length) {
        delete updatedSavings[year][month];
      }

      // delete empty year
      if (!Object.keys(updatedSavings[year]).length) {
        delete updatedSavings[year];
      }

      return {
        ...state,
        savings: updatedSavings,
      };
    },

    setSavingsTotals: (state, action) => {
      return {
        ...state,
        savingsTotals: action.payload,
      };
    },
    addYearSavingsTotals: (state, action) => {
      return {
        ...state,
        savingsTotals: {
          ...state.savingsTotals,
          ...action.payload,
        },
      };
    },

    setInvestments: (state, action) => {
      return {
        ...state,
        investments: action.payload,
      };
    },

    addInvestmentsGroupedByYearMonthWeek: (state, action) => {
      return {
        ...state,
        investments: {
          ...state.investments,
          ...action.payload,
        },
      };
    },

    addInvestment: (state, action) => {
      const { year, month, week, investment } = action.payload;

      const updatedInvestments = {
        ...state.investments,
        [year]: {
          ...(state.investments?.[year] || {}),
          [month]: {
            ...(state.investments?.[year]?.[month] || {}),
            [week]: [
              ...(state.investments?.[year]?.[month]?.[week] || []),
              investment,
            ],
          },
        },
      };

      return {
        ...state,
        investments: updatedInvestments,
      };
    },

    updateInvestment: (state, action) => {
      const {
        year: oldYear,
        month: oldMonth,
        week: oldWeek,
        investment,
      } = action.payload;
      const [newYear, newMonth, newDay] = investment.dateString.split('-').map(string => Number(string));
      let newWeek = getWeekNumberByDayNumber(newDay);

      const updatedInvestments = {
        ...state.investments,
        [oldYear]: {
          ...(state.investments?.[oldYear] || {}),
          [oldMonth]: {
            ...(state.investments?.[oldYear]?.[oldMonth] || {}),
            [oldWeek]: (state.investments?.[oldYear]?.[oldMonth]?.[oldWeek] || [])
              .filter(investmentItem => investmentItem.id !== investment.id),
          },
        },
      };
      updatedInvestments[newYear] = {
        ...(updatedInvestments?.[newYear] || {}),
        [newMonth]: {
          ...(updatedInvestments?.[newYear]?.[newMonth] || {}),
          [newWeek]: sortItemsByDateAsc([
            ...(updatedInvestments?.[newYear]?.[newMonth]?.[newWeek] || []),
            investment,
          ]),
        },
      };

      return {
        ...state,
        investments: updatedInvestments,
      };
    },

    deleteInvestment: (state, action) => {
      const { year, month, week, investment } = action.payload;

      const updatedInvestments = {
        ...state.investments,
        [year]: {
          ...(state.investments?.[year] || {}),
          [month]: {
            ...(state.investments?.[year]?.[month] || {}),
            [week]: [
              ...(state.investments?.[year]?.[month]?.[week] || [])
                .filter(weekInvestment => weekInvestment.id !== investment.id),
            ],
          },
        },
      };

      // after deletion, a week/month/year nodes can remain empty, so we need to clean up
      // delete empty week
      if (!updatedInvestments[year][month][week].length) {
        delete updatedInvestments[year][month][week];
      }

      // delete empty month
      if (!Object.keys(updatedInvestments[year][month]).length) {
        delete updatedInvestments[year][month];
      }

      // delete empty year
      if (!Object.keys(updatedInvestments[year]).length) {
        delete updatedInvestments[year];
      }

      return {
        ...state,
        investments: updatedInvestments,
      };
    },

    setInvestmentsTotals: (state, action) => {
      return {
        ...state,
        investmentsTotals: action.payload,
      };
    },
    addYearInvestmentsTotals: (state, action) => {
      return {
        ...state,
        investmentsTotals: {
          ...state.investmentsTotals,
          ...action.payload,
        },
      };
    },
  },
});

export const resetSavingsAndInvestmentsAction = savingsSlice.actions.resetSavingsAndInvestments;

export const setSavingsAction = savingsSlice.actions.setSavings;
export const addSavingsGroupedByYearMonthWeekAction = savingsSlice.actions.addSavingsGroupedByYearMonthWeek;
export const addSavingAction = savingsSlice.actions.addSaving;
export const updateSavingAction = savingsSlice.actions.updateSaving;
export const deleteSavingAction = savingsSlice.actions.deleteSaving;

export const setSavingsTotalsAction = savingsSlice.actions.setSavingsTotals;
export const addYearSavingsTotalsAction = savingsSlice.actions.addYearSavingsTotals;

export const setInvestmentsAction = savingsSlice.actions.setInvestments;
export const addInvestmentsGroupedByYearMonthWeekAction = savingsSlice.actions.addInvestmentsGroupedByYearMonthWeek;
export const addInvestmentAction = savingsSlice.actions.addInvestment;
export const updateInvestmentAction = savingsSlice.actions.updateInvestment;
export const deleteInvestmentAction = savingsSlice.actions.deleteInvestment;

export const setInvestmentsTotalsAction = savingsSlice.actions.setInvestmentsTotals;
export const addYearInvestmentsTotalsAction = savingsSlice.actions.addYearInvestmentsTotals;

export default savingsSlice.reducer;
