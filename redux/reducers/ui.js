import { createSlice } from '@reduxjs/toolkit';
import { TAB } from '../../components/HeaderTabs';

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    selectedTab: TAB.MONTHS,
    selectedYear: new Date().getFullYear(),
  },

  reducers: {
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

export const setSelectedTab = uiSlice.actions.setSelectedTab;
export const setSelectedYear = uiSlice.actions.setSelectedYear;

export default uiSlice.reducer;
