import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = {
  TOKEN: 'token',
  SELECTED_TAB: 'selectedTab',
  SELECTED_YEAR: 'selectedYear',
  SETTINGS: 'settings',
  CATEGORIES: 'categories',
  COLORS: 'colors',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
  INVESTMENTS: 'investments',
  INCOMES: 'incomes',
};

export function saveToStorage (key, value) {
  return AsyncStorage.setItem(key,
    typeof value === 'object'
      ? JSON.stringify(value)
      : value
  );
}

export async function retrieveFromStorage (key) {
  const stringValue = await AsyncStorage.getItem(key);

  let valueToReturn = stringValue;
  try {
    valueToReturn = JSON.parse(stringValue);
  } catch (error) {}

  return valueToReturn;
}
