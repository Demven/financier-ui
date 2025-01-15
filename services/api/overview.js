import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

// { expenses, expensesTotals, incomes, incomesTotals, savings, savingsTotals, investments, investmentsTotals }
export async function fetchOverviewForYear (year) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/overview?year=${year}`, {
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
