import { useState, useRef } from 'react';
import { Platform, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import PointInfo from '../../../../components/chart/PointInfo';
import Loader from '../../../../components/Loader';
import WeekChartLegend from './WeekChartLegend';
import { DAYS_IN_WEEK, formatDateString } from '../../../../services/date';
import { groupWeekByDay, mergeGroupedByDay } from '../../../../services/dataItems';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

export const CHART_VIEW = {
  INCOME: 'income',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
};

WeekChart.propTypes = {
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

export default function WeekChart (props) {
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

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const currencySymbol = useSelector(state => state.account.currencySymbol);

  const chartRef = useRef();

  const [loading, setLoading] = useState(true);

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

    if (Platform.OS === 'web') {
      const { width = 0, height = 0 } = chartRef?.current?.querySelector('svg > g > g:nth-child(7)')?.getBoundingClientRect() || {};

      if (width && height) {
        setRealChartWidth(width);
        setRealChartHeight(height);
      }
    }
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

  const expensesGroupedByDay = groupWeekByDay(expenses, daysInWeek);
  const expensesPoints = getChartPoints(expensesGroupedByDay, previousWeeksTotalExpenses);

  const incomesGroupedByDay = groupWeekByDay(incomes, daysInWeek);
  const incomesPoints = getChartPoints(incomesGroupedByDay, previousWeeksTotalIncomes);

  const savingsGroupedByDay = groupWeekByDay(savings, daysInWeek);
  const investmentsGroupedByDay = groupWeekByDay(investments, daysInWeek);
  const savingsAndInvestmentsGroupedByDay = mergeGroupedByDay(savingsGroupedByDay, investmentsGroupedByDay);
  const savingsPoints = getChartPoints(savingsAndInvestmentsGroupedByDay, previousWeeksTotalSavings + previousWeeksTotalInvestments);

  const loaderMarginLeft = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 16 // mobile
      : -24 // tablet
    : 0; // desktop

  return (
    <ScrollView
      style={[styles.weekChart, style]}
      ref={chartRef}
      onLayout={onLayout}
    >
      <Loader
        style={{ marginLeft: loaderMarginLeft }}
        loading={loading}
        setLoading={setLoading}
        timeout={500}
      />

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
          fillShadowGradientOpacity: 0,
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
        chartWidth={realChartWidth || chartWidth}
        chartHeight={realChartHeight || chartHeight}
        daysInWeek={daysInWeek}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  weekChart: {
    flexGrow: 1,
    position: 'relative',
  },

  chart: {
    width: '100%',
  },
});
