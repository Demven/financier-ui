import { retrieveFromStorage, STORAGE_KEY } from '../storage';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function addInvestment (investment) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/investment`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(investment),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function updateInvestment (investment) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/investment`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(investment),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function deleteInvestment (investment) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/investment`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(investment),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
