import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import incomesData from '../../data/incomes';

const incomesSlice = createSlice({
  name: 'incomes',

  initialState: {
    incomes: incomesData,
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
