import { COLOR } from '../styles/colors';

export function getAmount (item) {
  return item?.shares
    ? parseFloat((item.shares * item.pricePerShare).toFixed(2)) || 0
    : item?.amount || 0;
}

export function getMonthTotalAmount (items) {
  return Object
    .keys(items)
    .flatMap(week => {
      return (items[week] || []).reduce((total, item) => {
        const amount = item.amount || (item.shares * item.pricePerShare);
        return total + amount;
      }, 0);
    })
    .reduce((total, weekTotal) => total + weekTotal, 0);
}

export function formatAmount (number) {
  return `${Math.sign(number) === -1 ? '- ' : '+'}${parseFloat(Math.abs(number).toFixed(2)).toLocaleString()}`;
}

export function getAmountColor (amount) {
  const isPositive = amount >= 0;

  return isPositive ? COLOR.GREEN : COLOR.RED;
}

export function getListTotal (itemList) {
  return itemList.reduce((total, item) => {
    return total + getAmount(item);
  }, 0);
}
