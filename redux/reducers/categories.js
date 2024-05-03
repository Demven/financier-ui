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
      const updatedCategories = [
        ...state,
        action.payload,
      ];

      // TODO: POST to API
      // saveToStorage(STORAGE_KEY.CATEGORIES, updatedCategories);

      return updatedCategories;
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      const updatedCategories = state.map(category => {
        return category.id === updatedCategory.id
          ? updatedCategory
          : category;
      });

      // TODO: POST to API
      // saveToStorage(STORAGE_KEY.CATEGORIES, updatedCategories);

      return updatedCategories;
    },
  },
});

export const setCategoriesAction = categoriesSlice.actions.setCategories;
export const addCategoryAction = categoriesSlice.actions.addCategory;
export const updateCategoryAction = categoriesSlice.actions.updateCategory;

export default categoriesSlice.reducer;
