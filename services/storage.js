import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = {
  TOKEN: 'token',
  LAST_VISITED_PAGE: 'lastVisitedPage',
  LAST_VISITED_TIMESTAMP: 'lastVisitedTimestamp',
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

export async function clearStorage () {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Failed to clear async storage', error);
  }
}
