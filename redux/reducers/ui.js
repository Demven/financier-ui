import { createSlice } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import { TAB } from '../../components/HeaderTabs';

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
    setSelectedTab: (state, action) => ({
      ...state,
      selectedTab: action.payload.selectedTab,
    }),
    setSelectedYear: (state, action) => ({
      ...state,
      selectedYear: action.payload.selectedYear,
    }),
  },
});

export const setWindowWidthAction = uiSlice.actions.setWindowWidth;
export const setSelectedTabAction = uiSlice.actions.setSelectedTab;
export const setSelectedYearAction = uiSlice.actions.setSelectedYear;

export default uiSlice.reducer;
