import { createSlice } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import { TAB } from '../../components/HeaderTabs';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    windowWidth: Dimensions.get('window').width,
    selectedTab: TAB.MONTHS,
    selectedYear: new Date().getFullYear(),
  },

  reducers: {
    setWindowWidth: (state, action) => ({
      ...state,
      windowWidth: action.payload,
    }),
    setSelectedTab: (state, action) => {
      saveToStorage(STORAGE_KEY.SELECTED_TAB, action.payload);

      return {
        ...state,
        selectedTab: action.payload,
      };
    },
    setSelectedYear: (state, action) => {
      saveToStorage(STORAGE_KEY.SELECTED_YEAR, String(action.payload));

      return {
        ...state,
        selectedYear: action.payload,
      };
    },
  },
});

export const setWindowWidthAction = uiSlice.actions.setWindowWidth;
export const setSelectedTabAction = uiSlice.actions.setSelectedTab;
export const setSelectedYearAction = uiSlice.actions.setSelectedYear;

export default uiSlice.reducer;
