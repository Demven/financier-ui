import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

const apiUrl = API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;

export async function updateAccount (account) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/account`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(account),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .then(({ success }) => success)
    .catch(console.error);
}

export async function deleteAccount (accountId) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/account`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: accountId }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .then(({ success }) => success)
    .catch(console.error);
}
