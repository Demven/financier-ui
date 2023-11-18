import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';

const incomesSlice = createSlice({
  name: 'incomes',

  initialState: {
    incomes: {
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
    setIncomes: (state, action) => {
      saveToStorage(STORAGE_KEY.INCOMES, action.payload);

      return {
        ...state,
        incomes: action.payload,
      };
    },
    addIncome: (state, action) => {
      const { year, month, week, day, income } = action.payload;

      const updatedIncomes = {
        ...state.incomes,
        [year]: {
          ...(state.incomes?.[year] || {}),
          [month]: {
            ...(state.incomes?.[year]?.[month] || {}),
            [week]: {
              ...(state.incomes?.[year]?.[month]?.[week] || {}),
              [day]: [
                ...(state.incomes?.[year]?.[month]?.[week]?.[day] || []),
                income,
              ],
            },
          },
        },
      };

      saveToStorage(STORAGE_KEY.INCOMES, updatedIncomes);

      return {
        ...state,
        incomes: updatedIncomes,
      };
    },
  },
});

export const setIncomesAction = incomesSlice.actions.setIncomes;
export const addIncomeAction = incomesSlice.actions.addIncome;

export default incomesSlice.reducer;
