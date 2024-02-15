import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import WeekChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/WeekChartLegend';
import { MEDIA } from '../../../../styles/media';

WeekChart.propTypes = {
  style: PropTypes.any,
  expensesByDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  daysInWeek: PropTypes.number.isRequired,
  selectedDayIndex: PropTypes.number,
  onDaySelected: PropTypes.func.isRequired,
};

export default function WeekChart (props) {
  const {
    style,
    expensesByDays,
    daysInWeek,
    selectedDayIndex,
    onDaySelected,
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

  const loaderMarginLeft = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 72 // mobile
      : 40 // tablet
    : 0; // desktop

  return (
    <View
      style={[styles.weekChart, style]}
      onLayout={onLayout}
      ref={chartRef}
    >
      <Loader
        style={{ marginLeft: loaderMarginLeft }}
        loading={loading}
        setLoading={setLoading}
        timeout={500}
      />

      <BarChart
        style={styles.chart}
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
  );
}

const styles = StyleSheet.create({
  weekChart: {
    flexGrow: 1,
    position: 'relative',
  },

  chart: {
    width: '100%',
    marginTop: 72,
  },
});
