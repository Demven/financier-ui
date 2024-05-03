import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = {
  TOKEN: 'token',
  SELECTED_TAB: 'selectedTab',
  SELECTED_YEAR: 'selectedYear',
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

export function removeFromStorage (key) {
  return AsyncStorage.removeItem(key);
}
