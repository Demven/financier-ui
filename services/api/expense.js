import { retrieveFromStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

export async function fetchExpenseById (id) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/expense/${id}`, {
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

export async function fetchExpensesForYear (year) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/expense?year=${year}`, {
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

export async function addExpense (expense) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/expense`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function updateExpense (expense) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/expense`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}

export async function deleteExpense (expense) {
  const token = await retrieveFromStorage(STORAGE_KEY.TOKEN);

  return fetch(`${API_BASE_URL}/v1/expense`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch(console.error);
}
