import { createSlice } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEY } from '../../services/storage';
import categoriesData from '../../data/categories.json';

const categoriesSlice = createSlice({
  name: 'categories',

  initialState: categoriesData,

  reducers: {
    setCategories: (state, action) => {
      saveToStorage(STORAGE_KEY.CATEGORIES, action.payload);

      return [
        ...action.payload,
      ];
    },
    addCategory: (state, action) => {
      const updatedCategories = [
        ...state,
        action.payload,
      ];

      saveToStorage(STORAGE_KEY.CATEGORIES, updatedCategories);

      return updatedCategories;
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      const updatedCategories = state.map(category => {
        return category.id === updatedCategory.id
          ? updatedCategory
          : category;
      });

      saveToStorage(STORAGE_KEY.CATEGORIES, updatedCategories);

      return updatedCategories;
    },
  },
});

export const setCategoriesAction = categoriesSlice.actions.setCategories;
export const addCategoryAction = categoriesSlice.actions.addCategory;
export const updateCategoryAction = categoriesSlice.actions.updateCategory;

export default categoriesSlice.reducer;
