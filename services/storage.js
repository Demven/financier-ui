import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = {
  TOKEN: 'token',
  SETTINGS: 'settings',
  CATEGORIES: 'categories',
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
