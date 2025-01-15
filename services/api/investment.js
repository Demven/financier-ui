import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

export async function fetchInvestmentById (id) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/investment/${id}`, {
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

export async function fetchInvestmentsForYear (year) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/investment?year=${year}`, {
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

export async function addInvestment (investment) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/investment`, {
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

  return fetch(`${API_BASE_URL}/v1/investment`, {
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

  return fetch(`${API_BASE_URL}/v1/investment`, {
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
