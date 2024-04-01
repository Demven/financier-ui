import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import colorsData from '../../data/colors.json';

const categoriesSlice = createSlice({
  name: 'colors',

  initialState: colorsData,

  reducers: {
    setColors: (state, action) => {
      saveToStorage(STORAGE_KEY.COLORS, action.payload);

      return [
        ...action.payload,
      ];
    },
    addColor: (state, action) => {
      const updatedColors = [
        ...state,
        action.payload,
      ];

      saveToStorage(STORAGE_KEY.COLORS, updatedColors);

      return updatedColors;
    },
    deleteColor: (state, action) => {
      const colorId = action.payload;

      const updatedColors = state.filter(color => color.id !== colorId);

      saveToStorage(STORAGE_KEY.COLORS, updatedColors);

      return updatedColors;
    },
  },
});

export const setColorsAction = categoriesSlice.actions.setColors;
export const addColorAction = categoriesSlice.actions.addColor;
export const deleteColorAction = categoriesSlice.actions.deleteColor;

export default categoriesSlice.reducer;
