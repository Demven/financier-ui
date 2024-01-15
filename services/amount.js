import { COLOR } from '../styles/colors';

export function formatAmount (number) {
  return `${Math.sign(number) === -1 ? '- ' : '+'}${parseFloat(Math.abs(number).toFixed(2)).toLocaleString()}`;
}

export function getAmountColor (amount) {
  const isPositive = amount >= 0;

  return isPositive ? COLOR.GREEN : COLOR.RED;
}
