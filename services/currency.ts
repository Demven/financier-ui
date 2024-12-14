export const CURRENCY = {
  US_DOLLAR: 'USD',
  EURO: 'EUR',
  JAPANESE_YEN: 'JPU',
  POUND_STERLING: 'GPB',
  AUSTRALIAN_DOLLAR: 'AUD',
  CANADIAN_DOLLAR: 'CAD',
  SWISS_FRANC: 'CHF',
};

export const CURRENCIES = [
  { value: CURRENCY.US_DOLLAR, label: 'US Dollar ($)' },
  { value: CURRENCY.EURO, label: 'Euro (€)' },
  { value: CURRENCY.JAPANESE_YEN, label: 'Japanese Yen (¥)' },
  { value: CURRENCY.POUND_STERLING, label: 'Pound Sterling (£)' },
  { value: CURRENCY.AUSTRALIAN_DOLLAR, label: 'Australian Dollar ($)' },
  { value: CURRENCY.CANADIAN_DOLLAR, label: 'Canadian Dollar ($)' },
  { value: CURRENCY.SWISS_FRANC, label: 'Swiss Franc' },
];

export const CURRENCY_SYMBOL = {
  [CURRENCY.US_DOLLAR]: '$',
  [CURRENCY.EURO]: '€',
  [CURRENCY.JAPANESE_YEN]: '¥',
  [CURRENCY.POUND_STERLING]: '£',
  [CURRENCY.AUSTRALIAN_DOLLAR]: '$',
  [CURRENCY.CANADIAN_DOLLAR]: '$',
  [CURRENCY.SWISS_FRANC]: '',
};
