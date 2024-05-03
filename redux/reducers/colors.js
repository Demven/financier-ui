import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
  name: 'colors',

  initialState: [],

  reducers: {
    setColors: (state, action) => {
      return [
        ...action.payload,
      ];
    },
    addColor: (state, action) => {
      const updatedColors = [
        ...state,
        action.payload,
      ];

      // TODO: POST to API
      // saveToStorage(STORAGE_KEY.COLORS, updatedColors);

      return updatedColors;
    },
    deleteColor: (state, action) => {
      const colorId = action.payload;

      const updatedColors = state.filter(color => color.id !== colorId);

      // TODO: POST to API
      // saveToStorage(STORAGE_KEY.COLORS, updatedColors);

      return updatedColors;
    },
  },
});

export const setColorsAction = categoriesSlice.actions.setColors;
export const addColorAction = categoriesSlice.actions.addColor;
export const deleteColorAction = categoriesSlice.actions.deleteColor;

export default categoriesSlice.reducer;
