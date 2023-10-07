import { createSlice } from '@reduxjs/toolkit';
import { TAB } from '../../components/HeaderTabs';

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    selectedTab: TAB.MONTHS,
  },

  reducers: {
    setSelectedTab: (state, action) => ({
      ...state,
      selectedTab: action.payload.selectedTab,
    }),
  },
});

export const setSelectedTab = uiSlice.actions.setSelectedTab;

export default uiSlice.reducer;
