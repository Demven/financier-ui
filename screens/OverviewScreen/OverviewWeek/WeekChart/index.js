import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import PointInfo from '../../../../components/Chart/PointInfo';
import { formatDateString } from '../../../../services/date';
import WeekChartLegend from './WeekChartLegend';
import { COLOR } from '../../../../styles/colors';

export const CHART_VIEW = {
  INCOME: 'income',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
};

const DAYS_IN_WEEK = 7;

MonthChart.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  daysInWeek: PropTypes.number.isRequired,
  chartView: PropTypes.oneOf([
    CHART_VIEW.EXPENSES,
    CHART_VIEW.INCOME,
    CHART_VIEW.SAVINGS,
  ]),
  setChartView: PropTypes.func,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
    dateString: PropTypes.string.isRequired, // e.g. '2023-09-01'
    amount: PropTypes.number.isRequired,
  })),
  previousWeeksTotalExpenses: PropTypes.number.isRequired,
  incomes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dateString: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })),
  previousWeeksTotalIncomes: PropTypes.number.isRequired,
  savings: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dateString: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })),
  previousWeeksTotalSavings: PropTypes.number.isRequired,
  investments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dateString: PropTypes.string.isRequired,
    ticker: PropTypes.string.isRequired,
    pricePerShares: PropTypes.number.isRequired,
    shares: PropTypes.number.isRequired,
  })),
  previousWeeksTotalInvestments: PropTypes.number.isRequired,
};

export default function MonthChart (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    daysInWeek,
    chartView,
    setChartView = () => {},
    expenses = [],
    previousWeeksTotalExpenses = 0,
    incomes = [],
    previousWeeksTotalIncomes = 0,
    savings = [],
    previousWeeksTotalSavings = 0,
    investments = [],
    previousWeeksTotalInvestments = 0,
  } = props;

  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const chartRef = useRef();

  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [realChartWidth, setRealChartWidth] = useState(0);
  const [realChartHeight, setRealChartHeight] = useState(0);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedPointData, setSelectedPointData] = useState({
    title: '',
    subTitle: '',
    x: 0,
    y: 0,
    color: COLOR.DARK_GRAY,
  });

  function onLayout (event) {
    const { width } = event.nativeEvent.layout;

    setChartWidth(width);
    setChartHeight(Math.floor(width / 16 * 9));

    if (chartRef.current) {
      const { width = 0, height = 0 } = chartRef.current.querySelector('svg > g > g:nth-child(7)')?.getBoundingClientRect() || {};
      setRealChartWidth(width);
      setRealChartHeight(height);
    }
  }

  function groupByDay (week) {
    const groupedByDay = new Array(daysInWeek).fill([]);

    week.forEach(item => {
      const [, , dayOfMonth] = item?.dateString?.split('-')?.map(string => Number(string)) || [];
      const dayOfWeek = dayOfMonthToDayOfWeek(dayOfMonth);

      groupedByDay[dayOfWeek - 1] = Array.isArray(groupedByDay[dayOfWeek - 1])
        ? [...groupedByDay[dayOfWeek - 1], item]
        : [item];
    });

    return groupedByDay;
  }

  function mergeGroupedByDay (groupedByDay1 = [], groupedByDay2 = []) {
    return groupedByDay1.map((byDay1, index) => {
      const byDay2 = groupedByDay2[index] || [];

      return Array.isArray(byDay1)
        ? [...byDay1, ...byDay2]
        : byDay2;
    });
  }

  function dayOfMonthToDayOfWeek (dayOfMonth) {
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

  function getAmount (item) {
    return item?.shares
      ? parseFloat((item.shares * item.pricePerShare).toFixed(2)) || 0
      : item?.amount || 0;
  }

  function getChartPoints (groupedByDay, startingPoint = 0) {
    let totalOfPreviousDays = startingPoint;

    return [
      startingPoint,
      ...groupedByDay.map(itemsByDay => {
        if (!itemsByDay?.length) {
          return totalOfPreviousDays;
        }

        const dayTotal = itemsByDay.reduce((total, item) => {
          return total + getAmount(item);
        }, 0);

        totalOfPreviousDays = totalOfPreviousDays + dayTotal;

        return parseFloat(totalOfPreviousDays.toFixed(2));
      }),
    ];
  }

  function onPointClick ({ index, value, dataset, x, y }) {
    const clickedChartViewType = dataset.type;
    const color = clickedChartViewType === CHART_VIEW.EXPENSES
      ? getExpensesColor(1, CHART_VIEW.EXPENSES)
      : clickedChartViewType === CHART_VIEW.SAVINGS
        ? getSavingsColor(1, CHART_VIEW.SAVINGS)
        : clickedChartViewType === CHART_VIEW.INCOME
          ? getIncomesColor(1, CHART_VIEW.INCOME)
          : COLOR.LIGHT_GRAY;

    setChartView(clickedChartViewType);

    const dayOfMonth = ((weekNumber - 1) * DAYS_IN_WEEK) + index + 1;

    setSelectedPointData({
      title: formatDateString(`${year}-${`0${monthNumber}`.slice(-2)}-${`0${dayOfMonth}`.slice(-2)}`),
      subTitle: `${[clickedChartViewType[0].toUpperCase()]}${clickedChartViewType.slice(1)}:  ${currencySymbol}${value.toFixed(2)}`,
      x,
      y,
      color,
    });
    setTooltipVisible(true);
  }

  function getExpensesColor (opacity, chartView) {
    // COLOR.GRAY
    return `rgba(100, 100, 100, ${opacity * (chartView === CHART_VIEW.EXPENSES ? 3 : 1)})`;
  }

  function getIncomesColor (opacity, chartView) {
    // COLOR.MEDIUM_ORANGE
    return `rgba(238, 167, 76, ${opacity * (chartView === CHART_VIEW.INCOME ? 3 : 1)})`;
  }

  function getSavingsColor (opacity, chartView) {
    // COLOR.GREEN
    return `rgba(42, 113, 40, ${opacity * (chartView === CHART_VIEW.SAVINGS ? 3 : 1)})`;
  }

  const expensesGroupedByDay = groupByDay(expenses);
  const expensesPoints = getChartPoints(expensesGroupedByDay, previousWeeksTotalExpenses);

  const incomesGroupedByDay = groupByDay(incomes);
  const incomesPoints = getChartPoints(incomesGroupedByDay, previousWeeksTotalIncomes);

  const savingsGroupedByDay = groupByDay(savings);
  const investmentsGroupedByDay = groupByDay(investments);
  const savingsAndInvestmentsGroupedByDay = mergeGroupedByDay(savingsGroupedByDay, investmentsGroupedByDay);
  const savingsPoints = getChartPoints(savingsAndInvestmentsGroupedByDay, previousWeeksTotalSavings + previousWeeksTotalInvestments);

  return (
    <View
      style={[styles.monthChart, style]}
      ref={chartRef}
      onLayout={onLayout}
    >
      <LineChart
        style={styles.chart}
        width={chartWidth}
        height={chartHeight}
        data={{
          datasets: [
            {
              type: CHART_VIEW.EXPENSES,
              data: expensesPoints,
              color: (opacity = 1) => getExpensesColor(opacity, chartView),
            },
            {
              type: CHART_VIEW.INCOME,
              data: incomesPoints,
              color: (opacity = 1) => getIncomesColor(opacity, chartView),
            },
            {
              type: CHART_VIEW.SAVINGS,
              data: savingsPoints,
              color: (opacity = 1) => getSavingsColor(opacity, chartView),
            },
          ].filter(Boolean),
        }}
        chartConfig={{
          decimalPlaces: 2,
          strokeWidth: 6,
          fillShadowGradientOpacity: 0.5,
          useShadowColorFromDataset: true,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: 1,
            strokeWidth: 1,
          },
        }}
        // the solution to make it work on Web described here https://github.com/indiespirit/react-native-chart-kit/issues/609
        onDataPointClick={onPointClick}
        decorator={tooltipVisible ? () => (
          <PointInfo
            title={selectedPointData.title}
            subTitle={selectedPointData.subTitle}
            x={selectedPointData.x}
            y={selectedPointData.y}
            chartWidth={chartWidth}
            color={selectedPointData.color}
          />
        ) : undefined}
        withHorizontalLabels={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withVerticalLabels={false}
        withShadow
        bezier
        fromZero
        transparent
      />

      <WeekChartLegend
        daysInWeek={daysInWeek}
        chartWidth={realChartWidth}
        chartHeight={realChartHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthChart: {
    flexGrow: 1,
    position: 'relative',
  },

  chart: {
    width: '100%',
  },
});
