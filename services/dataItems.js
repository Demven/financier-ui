import { SHOW_ALL_CATEGORY_ID } from '../components/CategoryDropdown';
import { getAmount, getListTotal } from './amount';
import { dayOfMonthToDayOfWeek } from './date';

export function groupWeekByDay (weekItems, daysInWeek) {
  const groupedByDay = new Array(daysInWeek).fill([]);

  weekItems.forEach(item => {
    const [, , dayOfMonth] = item?.dateString?.split('-')?.map(string => Number(string)) || [];
    const dayOfWeek = dayOfMonthToDayOfWeek(dayOfMonth);

    groupedByDay[dayOfWeek - 1] = Array.isArray(groupedByDay[dayOfWeek - 1])
      ? [...groupedByDay[dayOfWeek - 1], item]
      : [item];
  });

  return groupedByDay;
}

export function groupMonthByDay (groupedByWeeks, daysInMonth) {
  const items = Object
    .keys(groupedByWeeks)
    .flatMap(weekNumber => groupedByWeeks?.[weekNumber]);
  const groupedByDay = Array.from(new Array(daysInMonth));

  items.forEach(item => {
    const [, , day] = item?.dateString?.split('-')?.map(string => Number(string)) || [];

    groupedByDay[day - 1] = Array.isArray(groupedByDay[day - 1])
      ? [...groupedByDay[day - 1], item]
      : [item];
  });

  return groupedByDay;
}

export function groupExpensesTotalsByCategoryId (expenses) {
  return expenses.reduce((groupedTotalsByCategoryId, expense) => {
      const categoryId = expense.categoryId;

    groupedTotalsByCategoryId[categoryId] = !!groupedTotalsByCategoryId[categoryId]
        ? groupedTotalsByCategoryId[categoryId] + getAmount(expense)
        : getAmount(expense);

      return groupedTotalsByCategoryId;
    }, {});
}

export function mergeGroupedByDay (groupedByDay1, groupedByDay2) {
  return groupedByDay1.map((byDay1, index) => {
    const byDay2 = groupedByDay2[index] || [];

    return Array.isArray(byDay1)
      ? [...byDay1, ...byDay2]
      : byDay2;
  });
}

export function mergeGroupedByWeek (groupedByWeek1, groupedByWeek2) {
  return {
    [1]: [...(groupedByWeek1[1] || []), ...(groupedByWeek2[1] || [])],
    [2]: [...(groupedByWeek1[2] || []), ...(groupedByWeek2[2] || [])],
    [3]: [...(groupedByWeek1[3] || []), ...(groupedByWeek2[3] || [])],
    [4]: [...(groupedByWeek1[4] || []), ...(groupedByWeek2[4] || [])],
  };
}

export function getMonthChartPointsByDay (groupedByDay) {
  let totalOfPreviousDays = 0;

  return groupedByDay.map(itemsByDay => {
    if (!itemsByDay?.length) {
      return totalOfPreviousDays;
    }

    const dayTotal = getListTotal(itemsByDay);
    totalOfPreviousDays = totalOfPreviousDays + dayTotal;

    return parseFloat(totalOfPreviousDays.toFixed(2));
  });
}

export function getMonthChartPointsByWeek (groupedByWeek) {
  return [
    getListTotal(groupedByWeek[1] || []),
    getListTotal(groupedByWeek[2] || []),
    getListTotal(groupedByWeek[3] || []),
    getListTotal(groupedByWeek[4] || []),
  ];
}

export function getWeekChartPointsByDay (groupedByDay) {
  return groupedByDay.map(day => getListTotal(day));
}

export function filterWeekExpensesByCategory (weekExpenses, categoryId) {
  return weekExpenses.filter(expense => {
    return categoryId && categoryId !== SHOW_ALL_CATEGORY_ID
      ? expense.categoryId === categoryId
      : true;
  });
}

export function filterMonthExpensesByCategory (monthExpenses, categoryId) {
  return {
    [1]: filterWeekExpensesByCategory(monthExpenses?.[1] || [], categoryId),
    [2]: filterWeekExpensesByCategory(monthExpenses?.[2] || [], categoryId),
    [3]: filterWeekExpensesByCategory(monthExpenses?.[3] || [], categoryId),
    [4]: filterWeekExpensesByCategory(monthExpenses?.[4] || [], categoryId),
  };
}

export function filterYearExpensesByCategory (yearExpenses, categoryId) {
  return {
    [1]: filterMonthExpensesByCategory(yearExpenses?.[1] || [], categoryId),
    [2]: filterMonthExpensesByCategory(yearExpenses?.[2] || [], categoryId),
    [3]: filterMonthExpensesByCategory(yearExpenses?.[3] || [], categoryId),
    [4]: filterMonthExpensesByCategory(yearExpenses?.[4] || [], categoryId),
    [5]: filterMonthExpensesByCategory(yearExpenses?.[5] || [], categoryId),
    [6]: filterMonthExpensesByCategory(yearExpenses?.[6] || [], categoryId),
    [7]: filterMonthExpensesByCategory(yearExpenses?.[7] || [], categoryId),
    [8]: filterMonthExpensesByCategory(yearExpenses?.[8] || [], categoryId),
    [9]: filterMonthExpensesByCategory(yearExpenses?.[9] || [], categoryId),
    [10]: filterMonthExpensesByCategory(yearExpenses?.[10] || [], categoryId),
    [11]: filterMonthExpensesByCategory(yearExpenses?.[11] || [], categoryId),
    [12]: filterMonthExpensesByCategory(yearExpenses?.[12] || [], categoryId),
  };
}
