import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import { getWeekNumberByDayNumber } from '../../services/date';
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
          [newWeek]: [
            ...(updatedIncomes?.[newYear]?.[newMonth]?.[newWeek] || []),
            income,
          ].sort((income1, income2) => {
            const date1 = +(new Date(income1.dateString));
            const date2 = +(new Date(income2.dateString));

            return date1 - date2; // asc
          }),
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
export const updateIncomeAction = incomesSlice.actions.updateIncome;

export default incomesSlice.reducer;
