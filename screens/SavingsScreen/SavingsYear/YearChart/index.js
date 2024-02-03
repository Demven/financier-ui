import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import YearChartLegend, { LEGEND_HEIGHT } from './YearChartLegend';
import { MEDIA } from '../../../../styles/media';

YearChart.propTypes = {
  style: PropTypes.any,
  savingsByMonths: PropTypes.arrayOf(PropTypes.number),
  selectedMonthIndex: PropTypes.number,
  onMonthSelected: PropTypes.func.isRequired,
};

export default function YearChart (props) {
  const {
    style,
    savingsByMonths,
    selectedMonthIndex,
    onMonthSelected,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

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
        data={savingsByMonths}
        getColor={(opacity = 1) => `rgba(42, 113, 40, ${opacity})`} // COLOR.GREEN
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
