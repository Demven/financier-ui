import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = [];

const categoriesSlice = createSlice({
  name: 'colors',

  initialState: INITIAL_STATE,

  reducers: {
    resetColors: () => INITIAL_STATE,

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

export const resetColorsAction = categoriesSlice.actions.resetColors;
export const setColorsAction = categoriesSlice.actions.setColors;
export const addColorAction = categoriesSlice.actions.addColor;
export const deleteColorAction = categoriesSlice.actions.deleteColor;

export default categoriesSlice.reducer;
