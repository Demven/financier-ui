export const MONTHS_IN_YEAR = 12;

export const MONTH_NAME = {
  [1]: 'January',
  [2]: 'February',
  [3]: 'March',
  [4]: 'April',
  [5]: 'May',
  [6]: 'June',
  [7]: 'July',
  [8]: 'August',
  [9]: 'September',
  [10]: 'October',
  [11]: 'November',
  [12]: 'December',
};

export function dateToDateString (date) {
  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getUTCDate()}`.slice(-2)}`;
}

export function formatDateString (dateString) {
  return new Date(dateString).toLocaleDateString();
}

export function getDaysInMonth (year, month) {
  return new Date(year, month, 0).getDate();
}

export function getDaysInWeek (weekNumber, daysInMonth) {
  return weekNumber === 4
    ? 7 + (daysInMonth - 28)
    : 7;
}
