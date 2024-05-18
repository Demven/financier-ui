import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
  name: 'categories',

  initialState: [],

  reducers: {
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

export const setCategoriesAction = categoriesSlice.actions.setCategories;
export const addCategoryAction = categoriesSlice.actions.addCategory;
export const updateCategoryAction = categoriesSlice.actions.updateCategory;

export default categoriesSlice.reducer;
