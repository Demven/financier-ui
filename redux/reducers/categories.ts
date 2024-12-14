import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = [];

const categoriesSlice = createSlice({
  name: 'categories',

  initialState: INITIAL_STATE,

  reducers: {
    resetCategories: () => INITIAL_STATE,
    setCategories: (state, action) => {
      return [
        ...action.payload,
      ];
    },

    addCategory: (state, action) => {
      return [
        ...state,
        action.payload,
      ];
    },

    updateCategory: (state, action) => {
      const updatedCategory = action.payload;

      return state.map(category => {
        return category.id === updatedCategory.id
          ? updatedCategory
          : category;
      });
    },
  },
});

export const resetCategoriesAction = categoriesSlice.actions.resetCategories;
export const setCategoriesAction = categoriesSlice.actions.setCategories;
export const addCategoryAction = categoriesSlice.actions.addCategory;
export const updateCategoryAction = categoriesSlice.actions.updateCategory;

export default categoriesSlice.reducer;
