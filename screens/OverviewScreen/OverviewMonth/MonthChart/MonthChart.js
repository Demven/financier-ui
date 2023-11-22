import {
  StyleSheet,
  View,
} from 'react-native';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { LineChart } from 'react-native-chart-kit';
import { COLOR } from '../../../../styles/colors';

MonthChart.propTypes = {
  style: PropTypes.object,
};

export default function MonthChart (props) {
  const {
    style,
  } = props;

  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  function onResizeChart () {
    const chartWidth = chartRef.current.offsetWidth;

    setChartWidth(chartWidth);
    setChartHeight(Math.floor(chartWidth / 16 * 9));
  }

  return (
    <View
      style={[styles.monthChart, style]}
      ref={chartRef}
      onLayout={onResizeChart}
    >
      <LineChart
        style={styles.chart}
        data={{
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ]
            }
          ]
        }}
        width={chartWidth}
        height={chartHeight}
        yAxisLabel='$'
        yAxisSuffix='k'
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundGradientFrom: COLOR.WHITE,
          backgroundGradientTo: COLOR.WHITE,
          fillShadowGradientFrom: COLOR.BRIGHT_ORANGE,
          fillShadowGradientTo: COLOR.ORANGE,
          decimalPlaces: 2,
          strokeWidth: 6,
          fillShadowGradientOpacity: 0.25,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '1',
            strokeWidth: '6',
            stroke: COLOR.BRIGHT_ORANGE,
          },
        }}
        withHorizontalLabels={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        bezier
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthChart: {
    flexGrow: 1,
  },

  chart: {
    width: '100%',
  },
});
