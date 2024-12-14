import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../Loader';
import BarChart from '../../../chart/BarChart';
import MonthChartLegend, { LEGEND_HEIGHT } from '../../../chart/legends/MonthChartLegend';
import { DAYS_IN_WEEK, WEEKS_IN_MONTH, getDaysInMonth } from '../../../../services/date';
import { MEDIA } from '../../../../styles/media';

MonthChart.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  incomesByWeeks: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedWeekIndex: PropTypes.number,
  onWeekSelected: PropTypes.func.isRequired,
};

export default function MonthChart (props) {
  const {
    style,
    year,
    monthNumber,
    incomesByWeeks,
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

  const daysNumber = getDaysInMonth(year, monthNumber);

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
        data={incomesByWeeks}
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
