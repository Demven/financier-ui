import { TAB } from '../components/HeaderTabs';

export function getQueryParam (queryParameterMame) {
  if (typeof window !== 'undefined' && window?.location?.search) {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);

    return params.get(queryParameterMame);
  }

  return '';
}

export function getTimespan (pathname) {
  return pathname.includes(TAB.WEEKS)
    ? TAB.WEEKS
    : pathname.includes(TAB.YEARS)
      ? TAB.YEARS
      : pathname.includes(TAB.MONTHS)
        ? TAB.MONTHS
        : '';
}
