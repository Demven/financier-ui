import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import YearChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/YearChartLegend';

YearChart.propTypes = {
  style: PropTypes.any,
  expensesByMonths: PropTypes.arrayOf(PropTypes.number),
  selectedMonthIndex: PropTypes.number,
  onMonthSelected: PropTypes.func.isRequired,
};

export default function YearChart (props) {
  const {
    style,
    expensesByMonths,
    selectedMonthIndex,
    onMonthSelected,
  } = props;

  const chartRef = useRef();

  const [loading, setLoading] = useState(true);

  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  function onLayout (event) {
    const { width } = event.nativeEvent.layout;

    setChartWidth(width);
    setChartHeight(Math.floor(width / 16 * 9));
  }

  return (
    <View
      style={[styles.monthChart, style]}
      ref={chartRef}
      onLayout={onLayout}
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
        data={expensesByMonths}
        getColor={(opacity = 1) => `rgba(100, 100, 100, ${opacity})`} // COLOR.GRAY
        barSelected={selectedMonthIndex}
        onBarSelected={onMonthSelected}
      />

      <YearChartLegend
        chartWidth={chartWidth}
        selectedMonthIndex={selectedMonthIndex}
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
    marginTop: 72,
  },
});
