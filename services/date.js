export function dateToDateString (date) {
  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getUTCDate()}`.slice(-2)}`;
}

export function formatDateString (dateString) {
  return new Date(dateString).toLocaleDateString();
}
