import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

const apiUrl = API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchSavingById (id) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/saving/${id}`, {
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

export async function fetchSavingsForYear (year) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/saving?year=${year}`, {
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

export async function addSaving (saving) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/saving`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saving),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function updateSaving (saving) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/saving`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saving),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function deleteSaving (saving) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${apiUrl}/v1/saving`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saving),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
