import { useState, useRef } from 'react';
import { Platform, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import PointInfo from '../../../../components/Chart/PointInfo';
import { MONTH_NAME } from '../../../../services/date';
import YearChartLegend from './YearChartLegend';
import { COLOR } from '../../../../styles/colors';

export const CHART_VIEW = {
  INCOME: 'income',
  EXPENSES: 'expenses',
  SAVINGS: 'savings',
};

const MONTHS_IN_YEAR = 12;

YearChart.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  chartView: PropTypes.oneOf([
    CHART_VIEW.EXPENSES,
    CHART_VIEW.INCOME,
    CHART_VIEW.SAVINGS,
  ]),
  setChartView: PropTypes.func,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

export default function YearChart (props) {
  const {
    style,
    year,
    chartView,
    setChartView = () => {},
    expenses,
    incomes,
    savings,
    investments,
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

  function groupByMonth (yearItems) {
    const groupedByMonth = new Array(MONTHS_IN_YEAR).fill([]);

    Object.keys(yearItems).forEach(monthNumber => {
      groupedByMonth[monthNumber - 1] = [
        ...(yearItems[monthNumber][1] || []),
        ...(yearItems[monthNumber][2] || []),
        ...(yearItems[monthNumber][3] || []),
        ...(yearItems[monthNumber][4] || []),
      ];
    });

    return groupedByMonth;
  }

  function mergeGroupedByMonth (groupedByMonth1 = [], groupedByMonth2 = []) {
    return groupedByMonth1.map((byMonth1, index) => {
      const byMonth2 = groupedByMonth2[index] || [];

      return Array.isArray(byMonth1)
        ? [...byMonth1, ...byMonth2]
        : byMonth2;
    });
  }

  function getAmount (item) {
    return item?.shares
      ? parseFloat((item.shares * item.pricePerShare).toFixed(2)) || 0
      : item?.amount || 0;
  }

  function getChartPoints (groupedByMonth) {
    let totalOfPreviousMonths = 0;

    return [
      totalOfPreviousMonths,
      ...groupedByMonth.map(itemsByMonth => {
        if (!itemsByMonth?.length) {
          return totalOfPreviousMonths;
        }

        const monthTotal = itemsByMonth.reduce((total, item) => {
          return total + getAmount(item);
        }, 0);

        totalOfPreviousMonths = totalOfPreviousMonths + monthTotal;

        return parseFloat(totalOfPreviousMonths.toFixed(2));
      })
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

    setSelectedPointData({
      title: index === 0 ? `Start of ${year}` : `${MONTH_NAME[index]}, ${year}`,
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

  const expensesGroupedByMonth = groupByMonth(expenses);
  const expensesPoints = getChartPoints(expensesGroupedByMonth);

  const incomesGroupedByMonth = groupByMonth(incomes);
  const incomesPoints = getChartPoints(incomesGroupedByMonth);

  const savingsGroupedByMonth = groupByMonth(savings);
  const investmentsGroupedByMonth = groupByMonth(investments);
  const savingsAndInvestmentsGroupedByMonth = mergeGroupedByMonth(savingsGroupedByMonth, investmentsGroupedByMonth);
  const savingsPoints = getChartPoints(savingsAndInvestmentsGroupedByMonth);

  return (
    <ScrollView
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

      <YearChartLegend
        chartWidth={realChartWidth || chartWidth}
        chartHeight={realChartHeight || chartHeight}
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
