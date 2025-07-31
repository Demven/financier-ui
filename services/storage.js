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
    // Instead of AsyncStorage.clear(), manually remove known keys
    const keys = Object.values(STORAGE_KEY);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Failed to clear async storage', error);
    // Fallback: try to remove keys individually
    try {
      const keys = Object.values(STORAGE_KEY);
      await Promise.all(keys.map(removeFromStorage));
    } catch (fallbackError) {
      console.error('Failed to clear storage with fallback method', fallbackError);
    }
  }
}
