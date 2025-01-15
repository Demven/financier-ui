import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

export async function fetchCategoryById (id) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/category/${id}`, {
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

export async function addCategory (category) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/category`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function updateCategory (category) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/category`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
