import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { LineChart } from 'react-native-chart-kit';

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
      {/*<Image*/}
      {/*  style={[styles.chart, { height: chartHeight }]}*/}
      {/*  ref={chartRef}*/}
      {/*  source={require('../../../../assets/images/charts/chart-months.jpg')}*/}
      {/*  resizeMode='cover'*/}
      {/*  onLayout={onResizeChart}*/}
      {/*/>*/}

      <LineChart
        style={styles.chart}
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }
          ]
        }}
        width={chartWidth}
        height={chartHeight}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
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
