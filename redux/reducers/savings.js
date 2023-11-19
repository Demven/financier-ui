import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import savingsData from '../../data/savings';
import investmentsData from '../../data/investments';

const savingsSlice = createSlice({
  name: 'savings',

  initialState: {
    savings: savingsData,
    investments: investmentsData,
  },

  reducers: {
    setSavings: (state, action) => {
      saveToStorage(STORAGE_KEY.SAVINGS, action.payload);

      return {
        ...state,
        savings: action.payload,
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

      saveToStorage(STORAGE_KEY.SAVINGS, updatedSavings);

      return {
        ...state,
        savings: updatedSavings,
      };
    },

    setInvestments: (state, action) => {
      saveToStorage(STORAGE_KEY.INVESTMENTS, action.payload);

      return {
        ...state,
        investments: action.payload,
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

      saveToStorage(STORAGE_KEY.INVESTMENTS, updatedInvestments);

      return {
        ...state,
        investments: updatedInvestments,
      };
    },
  },
});

export const setSavingsAction = savingsSlice.actions.setSavings;
export const addSavingAction = savingsSlice.actions.addSaving;
export const setInvestmentsAction = savingsSlice.actions.setInvestments;
export const addInvestmentAction = savingsSlice.actions.addInvestment;

export default savingsSlice.reducer;
