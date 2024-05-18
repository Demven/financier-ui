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
      return [
        ...state,
        action.payload,
      ];
    },
    deleteColor: (state, action) => {
      const { id: colorId } = action.payload;

      return state.filter(color => color.id !== colorId);
    },
  },
});

export const setColorsAction = categoriesSlice.actions.setColors;
export const addColorAction = categoriesSlice.actions.addColor;
export const deleteColorAction = categoriesSlice.actions.deleteColor;

export default categoriesSlice.reducer;
