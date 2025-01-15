import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

const apiUrl = API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;

export async function addColor (color) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/color`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(color),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function updateColor (color) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/color`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(color),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function deleteColor (color) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/color`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(color),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
