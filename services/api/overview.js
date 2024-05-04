import { retrieveFromStorage, STORAGE_KEY } from '../storage';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// { expenses, incomes, savings, investments }
export async function fetchOverviewForYear (year) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/overview?year=${year}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
