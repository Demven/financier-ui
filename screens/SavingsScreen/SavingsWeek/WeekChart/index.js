import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import WeekChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/WeekChartLegend';

WeekChart.propTypes = {
  style: PropTypes.any,
  savingsAndInvestmentsByDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  daysInWeek: PropTypes.number.isRequired,
  selectedDayIndex: PropTypes.number,
  onDaySelected: PropTypes.func.isRequired,
};

export default function WeekChart (props) {
  const {
    style,
    savingsAndInvestmentsByDays,
    daysInWeek,
    selectedDayIndex,
    onDaySelected,
  } = props;

  const [loading, setLoading] = useState(true);

  const chartRef = useRef();

  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  function onLayout (event) {
    const { width } = event.nativeEvent.layout;

    setChartWidth(width);
    setChartHeight(Math.floor(width / 16 * 9));
  }

  return (
    <View
      style={[styles.weekChart, style]}
      onLayout={onLayout}
      ref={chartRef}
    >
      <Loader
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
