import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import WeekChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/WeekChartLegend';
import CompareStats from '../../../../components/CompareStats';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

WeekChart.propTypes = {
  style: PropTypes.any,
  savingsAndInvestmentsByDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  daysInWeek: PropTypes.number.isRequired,
  selectedDayIndex: PropTypes.number,
  onDaySelected: PropTypes.func.isRequired,
  totalSavingsAndInvestments: PropTypes.number.isRequired,
  monthTotalSavingsAndInvestments: PropTypes.number.isRequired,
  previousWeekSavingsAndInvestments: PropTypes.number,
  previousMonthName: PropTypes.string,
  allTimeWeekAverage: PropTypes.number.isRequired,
};

export default function WeekChart (props) {
  const {
    style,
    savingsAndInvestmentsByDays,
    daysInWeek,
    selectedDayIndex,
    onDaySelected,
    totalSavingsAndInvestments,
    monthTotalSavingsAndInvestments,
    previousWeekSavingsAndInvestments,
    previousMonthName,
    allTimeWeekAverage,
  } = props;

  const [loading, setLoading] = useState(true);

  const chartRef = useRef();

  const windowWidth = useSelector(state => state.ui.windowWidth);

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
          style={styles.chart}
          width={chartWidth}
          height={chartHeight}
          legendHeight={LEGEND_HEIGHT}
          data={savingsAndInvestmentsByDays}
          getColor={(opacity = 1) => `rgba(42, 113, 40, ${opacity})`} // COLOR.GREEN
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
          compareWhat={totalSavingsAndInvestments}
          compareTo={monthTotalSavingsAndInvestments}
          previousResult={previousWeekSavingsAndInvestments}
          previousResultName={previousMonthName}
          allTimeAverage={allTimeWeekAverage}
          showSecondaryComparisons
          circleSubText='of month'
          circleSubTextColor={COLOR.GRAY}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weekChart: {
    flexGrow: 1,
    position: 'relative',
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
    marginTop: 72,
  },

  compareStats: {
    marginTop: 52,
  },
});
