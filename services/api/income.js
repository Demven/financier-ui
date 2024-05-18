import { retrieveFromStorage, STORAGE_KEY } from '../storage';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function addIncome (income) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/income`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(income),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function updateIncome (income) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/income`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(income),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function deleteIncome (income) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/income`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(income),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
