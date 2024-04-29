const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export function signIn (email, password) {
  console.info('process.env', process.env);

  return fetch(`${apiUrl}/v1/auth/sign-in`, {
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

      throw new Error('Failed to get response');
    })
    .then(data => data.token)
    .catch(console.error);
}
