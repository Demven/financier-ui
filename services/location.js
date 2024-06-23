export function getQueryParam (queryParameterMame) {
  if (typeof window !== 'undefined' && window.location.search) {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);

    return params.get(queryParameterMame);
  }

  return '';
}

export function getPathName () {
  return (typeof window !== 'undefined' && window.location.pathname) || '';
}
