import { createSlice } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import { TAB } from '../../components/HeaderTabs';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';

export const TOAST_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

const getInitialState = () => ({
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  selectedTab: TAB.MONTHS,
  selectedYear: new Date().getFullYear(),
  selectedMonth: undefined,
  selectedWeek: undefined,
  title: '',
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },
  loading: true, // on first load, the loading state is true by default
  reinitialize: false,
  dataRefreshed: +new Date(),
});

const uiSlice = createSlice({
  name: 'ui',

  initialState: getInitialState(),

  reducers: {
    resetUI: () => getInitialState(),

    setWindowWidth: (state, action) => ({
      ...state,
      windowWidth: action.payload,
    }),
    setWindowHeight: (state, action) => ({
      ...state,
      windowHeight: action.payload,
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
    setSelectedMonth: (state, action) => {
      return {
        ...state,
        selectedMonth: action.payload,
      };
    },
    setSelectedWeek: (state, action) => {
      return {
        ...state,
        selectedWeek: action.payload,
      };
    },

    setTitle: (state, action) => {
      return {
        ...state,
        title: action.payload,
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
          type: 'info',
          visible: false,
        },
      };
    },

    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },

    reinitialize: (state, action) => {
      return {
        ...state,
        reinitialize: action.payload === true,
      };
    },

    setDataRefreshed: (state, action) => {
      return {
        ...state,
        dataRefreshed: action.payload,
      };
    },
  },
});

export const resetUIAction = uiSlice.actions.resetUI;

export const setWindowWidthAction = uiSlice.actions.setWindowWidth;
export const setWindowHeightAction = uiSlice.actions.setWindowHeight;

export const setSelectedTabAction = uiSlice.actions.setSelectedTab;

export const setSelectedYearAction = uiSlice.actions.setSelectedYear;
export const setSelectedMonthAction = uiSlice.actions.setSelectedMonth;
export const setSelectedWeekAction = uiSlice.actions.setSelectedWeek;

export const setTitleAction = uiSlice.actions.setTitle;

export const showToastAction = uiSlice.actions.showToast;
export const hideToastAction = uiSlice.actions.hideToast;

export const setLoadingAction = uiSlice.actions.setLoading;

export const reinitializeAction = uiSlice.actions.reinitialize;

export const setDataRefreshedAction = uiSlice.actions.setDataRefreshed;

export default uiSlice.reducer;
