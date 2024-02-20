import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import incomesData from '../../data/incomes';
import incomesTotalData from '../../data/incomesTotal';

const incomesSlice = createSlice({
  name: 'incomes',

  initialState: {
    incomes: incomesData,
    incomesTotal: incomesTotalData,
    yearAverage: incomesTotalData.yearAverage,
    monthAverage: incomesTotalData.monthAverage,
    weekAverage: incomesTotalData.weekAverage,
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
