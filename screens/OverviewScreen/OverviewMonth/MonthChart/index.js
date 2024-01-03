import { useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import PointInfo from '../../../../components/Chart/PointInfo';
import { formatDateString } from '../../../../services/date';
import MonthChartLegend from './MonthChartLegend';
import { COLOR } from '../../../../styles/colors';

function daysInMonth (year, month) {
  return new Date(year, month, 0).getDate();
}

export const CHART_VIEW = {
  INCOME: 'income',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
};

MonthChart.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  chartView: PropTypes.oneOf([
    CHART_VIEW.EXPENSES,
    CHART_VIEW.INCOME,
    CHART_VIEW.SAVINGS,
  ]),
  setChartView: PropTypes.func,
  expenses: PropTypes.shape({
    1: PropTypes.arrayOf(PropTypes.object),
    2: PropTypes.arrayOf(PropTypes.object),
    3: PropTypes.arrayOf(PropTypes.object),
    4: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  incomes: PropTypes.shape({
    1: PropTypes.arrayOf(PropTypes.object),
    2: PropTypes.arrayOf(PropTypes.object),
    3: PropTypes.arrayOf(PropTypes.object),
    4: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  savings: PropTypes.shape({
    1: PropTypes.arrayOf(PropTypes.object),
    2: PropTypes.arrayOf(PropTypes.object),
    3: PropTypes.arrayOf(PropTypes.object),
    4: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  investments: PropTypes.shape({
    1: PropTypes.arrayOf(PropTypes.object),
    2: PropTypes.arrayOf(PropTypes.object),
    3: PropTypes.arrayOf(PropTypes.object),
    4: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default function MonthChart (props) {
  const {
    style,
    year,
    monthNumber,
    chartView,
    setChartView = () => {},
    expenses = {},
    incomes = {},
    savings = {},
    investments = {},
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

    if (Platform.OS === 'web') {
      const { width = 0, height = 0 } = chartRef?.current?.querySelector('svg > g > g:nth-child(7)')?.getBoundingClientRect() || {};

      if (width && height) {
        setRealChartWidth(width);
        setRealChartHeight(height);
      }
    }
  }

  const daysNumber = daysInMonth(year, monthNumber);

  function groupByDay (groupedByWeeks) {
    const items = Object
      .keys(groupedByWeeks)
      .flatMap(weekNumber => groupedByWeeks?.[weekNumber]);
    const groupedByDay = Array.from(new Array(daysNumber));

    items.forEach(item => {
      const [, , day] = item?.dateString?.split('-')?.map(string => Number(string)) || [];

      groupedByDay[day - 1] = Array.isArray(groupedByDay[day - 1])
        ? [...groupedByDay[day - 1], item]
        : [item];
    });

    return groupedByDay;
  }

  function mergeGroupedByDay (groupedByDay1, groupedByDay2) {
    return groupedByDay1.map((byDay1, index) => {
      const byDay2 = groupedByDay2[index] || [];

      return Array.isArray(byDay1)
        ? [...byDay1, ...byDay2]
        : byDay2;
    });
  }

  function getAmount (item) {
    return item?.shares
      ? parseFloat((item.shares * item.pricePerShare).toFixed(2)) || 0
      : item?.amount || 0;
  }

  function getChartPoints (groupedByDay) {
    let totalOfPreviousDays = 0;

    return groupedByDay.map(itemsByDay => {
      if (!itemsByDay?.length) {
        return totalOfPreviousDays;
      }

      const dayTotal = itemsByDay.reduce((total, item) => {
        return total + getAmount(item);
      }, 0);

      totalOfPreviousDays = totalOfPreviousDays + dayTotal;

      return parseFloat(totalOfPreviousDays.toFixed(2));
    });
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

    setSelectedPointData({
      title: formatDateString(`${year}-${`0${monthNumber}`.slice(-2)}-${`0${index + 1}`.slice(-2)}`),
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
  const expensesPoints = getChartPoints(expensesGroupedByDay);

  const incomesGroupedByDay = groupByDay(incomes);
  const incomesPoints = getChartPoints(incomesGroupedByDay);

  const savingsGroupedByDay = groupByDay(savings);
  const investmentsGroupedByDay = groupByDay(investments);
  const savingsAndInvestmentsGroupedByDay = mergeGroupedByDay(savingsGroupedByDay, investmentsGroupedByDay);
  const savingsPoints = getChartPoints(savingsAndInvestmentsGroupedByDay);

  return (
    <ScrollView
      style={[styles.monthChart, style]}
      onLayout={onLayout}
      ref={chartRef}
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
          ],
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

      <MonthChartLegend
        chartWidth={realChartWidth || chartWidth}
        chartHeight={realChartHeight || chartHeight}
        daysInMonth={daysNumber}
      />
    </ScrollView>
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
