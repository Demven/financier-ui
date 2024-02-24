import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import MonthChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/MonthChartLegend';
import { DAYS_IN_WEEK, WEEKS_IN_MONTH } from '../../../../services/date';
import { MEDIA } from '../../../../styles/media';

function daysInMonth (year, month) {
  return new Date(year, month, 0).getDate();
}

MonthChart.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  expensesByWeeks: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedWeekIndex: PropTypes.number,
  onWeekSelected: PropTypes.func.isRequired,
};

export default function MonthChart (props) {
  const {
    style,
    year,
    monthNumber,
    expensesByWeeks,
    selectedWeekIndex,
    onWeekSelected,
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

  const daysNumber = daysInMonth(year, monthNumber);

  return (
    <View
      style={[styles.monthChart, style]}
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
        data={expensesByWeeks}
        barsProportion={[
          DAYS_IN_WEEK,
          DAYS_IN_WEEK,
          DAYS_IN_WEEK,
          DAYS_IN_WEEK + (daysNumber - DAYS_IN_WEEK * WEEKS_IN_MONTH),
        ]}
        getColor={(opacity = 1) => `rgba(238, 167, 76, ${opacity})`} // COLOR.MEDIUM_ORANGE
        barSelected={selectedWeekIndex}
        onBarSelected={onWeekSelected}
      />

      <MonthChartLegend
        width={chartWidth}
        daysInMonth={daysNumber}
        selectedWeekIndex={selectedWeekIndex}
        barsProportion={[
          DAYS_IN_WEEK,
          DAYS_IN_WEEK,
          DAYS_IN_WEEK,
          DAYS_IN_WEEK + (daysNumber - DAYS_IN_WEEK * WEEKS_IN_MONTH),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthChart: {
    flexGrow: 1,
    position: 'relative',
  },

  loader: {
    marginTop: 32,
  },

  chart: {
    width: '100%',
    marginTop: 80,
  },
  chartMobile: {
    marginTop: 180,
  },
});
