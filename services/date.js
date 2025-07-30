import moment from 'moment';

export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_YEAR = 12;
export const WEEKS_IN_MONTH = 4;

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

export function dateStringToDate (dateString) {
  return new Date(moment(dateString).add(12, 'hours'));
}

export function dateToDateString (date) {
  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getUTCDate()}`.slice(-2)}`;
}

export function formatDateString (dateString) {
  return moment(dateString).format('MMM DD yyyy');
}

export function getDaysInMonth (year, month) {
  return new Date(year, month, 0).getDate();
}

export function getDaysInWeek (weekNumber, daysInMonth) {
  return weekNumber === 4
    ? 7 + (daysInMonth - 28)
    : 7;
}

export function dayOfMonthToDayOfWeek (dayOfMonth) {
  const isFourthWeek = dayOfMonth / DAYS_IN_WEEK > 3;
  const remainder = dayOfMonth % DAYS_IN_WEEK;

  // 1 - 7 -> 1 - 7
  // 8 - 14 -> 1 - 7
  // 15 - 21 -> 1 - 7
  // 22 - 31 -> 1 - 10
  return isFourthWeek
    ? dayOfMonth - (DAYS_IN_WEEK * 3)
    : remainder === 0 ? 7 : remainder;
}

export function getWeekRange (weekNumber, daysInMonth) {
  const range = {
    [1]: '1 - 7',
    [2]: '8 - 14',
    [3]: '15 - 21',
    [4]: `22 - ${daysInMonth}`,
  };

  return range[weekNumber];
}

export function getLastMonthNumberInYear (yearItems = {}) {
  return Object.keys(yearItems)
    .map(key => Number(key))
    .sort((a, b) => a - b)
    .pop();
}

export function getWeekNumberByDayNumber (day) {
  let week = 1;
  if (day <= 7) {
    week = 1;
  } else if (day > 7 && day <= 14) {
    week = 2;
  } else if (day > 14 && day <= 21) {
    week = 3;
  } else if (day > 21) {
    week = 4;
  }

  return week;
}

export function getDateTimeAgoFrom (date) {
  return moment(date).fromNow();
}
