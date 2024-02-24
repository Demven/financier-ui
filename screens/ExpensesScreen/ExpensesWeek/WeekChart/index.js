import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import WeekChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/WeekChartLegend';
import CompareStats from '../../../../components/CompareStats';
import { MEDIA } from '../../../../styles/media';

WeekChart.propTypes = {
  style: PropTypes.any,
  expensesByDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  daysInWeek: PropTypes.number.isRequired,
  selectedDayIndex: PropTypes.number,
  onDaySelected: PropTypes.func.isRequired,
  totalExpenses: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  previousWeekTotalExpenses: PropTypes.number,
  previousMonthName: PropTypes.string.isRequired,
  allTimeWeekAverage: PropTypes.number,
  showSecondaryComparisons: PropTypes.bool.isRequired,
};

export default function WeekChart (props) {
  const {
    style,
    expensesByDays,
    daysInWeek,
    selectedDayIndex,
    onDaySelected,
    totalExpenses,
    monthIncome,
    previousWeekTotalExpenses,
    previousMonthName,
    allTimeWeekAverage,
    showSecondaryComparisons,
  } = props;

  const [loading, setLoading] = useState(true);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const chartRef = useRef();

  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  function onLayout (event) {
    const { width } = event.nativeEvent.layout;

    setChartWidth(width);
    setChartHeight(Math.floor(width / 16 * 9));
  }

  return (
    <View style={[styles.weekChart, style]}>
      <View
        style={styles.chartContainer}
        onLayout={onLayout}
        ref={chartRef}
      >
        <Loader
          style={styles.loader}
          loading={loading}
          setLoading={setLoading}
          timeout={500}
        />

        <BarChart
          style={[styles.chart, windowWidth < MEDIA.TABLET && styles.chartMobile]}
          width={chartWidth}
          height={chartHeight}
          legendHeight={LEGEND_HEIGHT}
          data={expensesByDays}
          getColor={(opacity = 1) => `rgba(100, 100, 100, ${opacity})`} // COLOR.GRAY
          barSelected={selectedDayIndex}
          onBarSelected={onDaySelected}
        />

        <WeekChartLegend
          daysInWeek={daysInWeek}
          selectedDayIndex={selectedDayIndex}
        />
      </View>

      {windowWidth >= MEDIA.DESKTOP && (
        <CompareStats
          style={styles.compareStats}
          compareWhat={-totalExpenses}
          compareTo={monthIncome}
          previousResult={-previousWeekTotalExpenses}
          previousResultName={previousMonthName}
          allTimeAverage={-allTimeWeekAverage}
          showSecondaryComparisons={showSecondaryComparisons}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weekChart: {
    flexGrow: 1,
  },

  loader: {
    marginTop: 32,
  },

  chartContainer: {
    width: '100%',
    position: 'relative',
  },

  chart: {
    width: '100%',
    marginTop: 80,
  },
  chartMobile: {
    marginTop: 180,
  },

  compareStats: {
    marginTop: 52,
  },
});
