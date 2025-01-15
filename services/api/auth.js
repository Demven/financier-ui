import { saveToStorage, STORAGE_KEY } from '../storage';
import { API_BASE_URL } from '../../app.config';

export function signIn (email, password) {
  return fetch(`${API_BASE_URL}/v1/auth/sign-in`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error(API_BASE_URL + 'Failed to get response');
    })
    .then(data => data.token)
    .catch((error) => {
      console.error(error);
      return '';
    });
}

export function validateToken (token) {
  return fetch(`${API_BASE_URL}/v1/auth/validate-token`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .then(({ success, payload, refreshToken }) => {
      if (refreshToken) {
        saveToStorage(STORAGE_KEY.TOKEN, refreshToken);
      }

      return success
        ? payload
        : undefined;
    })
    .catch(console.error);
}

export function register (account) {
  return fetch(`${API_BASE_URL}/v1/auth/register`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
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
    .catch((error) => {
      console.error(error);

      return {
        success: false,
        error: error.message,
      };
    });
}

export function confirmEmail (token) {
  return fetch(`${API_BASE_URL}/v1/auth/confirm-email`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch((error) => {
      console.error(error);

      return {
        success: false,
        error: error.message,
      };
    });
}

export function resetPassword (email) {
  return fetch(`${API_BASE_URL}/v1/auth/reset-password`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch((error) => {
      console.error(error);

      return {
        success: false,
        error: error.message,
      };
    });
}

export function setUpNewPassword (token, password) {
  return fetch(`${API_BASE_URL}/v1/auth/set-up-new-password`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error('Failed to get response');
    })
    .catch((error) => {
      console.error(error);

      return {
        success: false,
        error: error.message,
      };
    });
}
