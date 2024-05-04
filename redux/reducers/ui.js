import { createSlice } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import { TAB } from '../../components/HeaderTabs';
import { TOAST_TYPE } from '../../components/Toast';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    windowWidth: Dimensions.get('window').width,
    selectedTab: TAB.MONTHS,
    selectedYear: new Date().getFullYear(),
    toast: {
      message: '',
      type: TOAST_TYPE.INFO,
      visible: false,
    },
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
    showToast: (state, action) => {
      return {
        ...state,
        toast: { ...action.payload, visible: true },
      };
    },
    hideToast: (state) => {
      return {
        ...state,
        toast: {
          message: '',
          type: TOAST_TYPE.INFO,
          visible: false,
        },
      };
    },
  },
});

export const setWindowWidthAction = uiSlice.actions.setWindowWidth;
export const setSelectedTabAction = uiSlice.actions.setSelectedTab;
export const setSelectedYearAction = uiSlice.actions.setSelectedYear;
export const showToastAction = uiSlice.actions.showToast;
export const hideToastAction = uiSlice.actions.hideToast;

export default uiSlice.reducer;
