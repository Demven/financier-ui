import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import YearChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/YearChartLegend';
import { MEDIA } from "../../../../styles/media";
import CompareStats from "../../../../components/CompareStats";
import { COLOR } from "../../../../styles/colors";
import { useSelector } from "react-redux";

YearChart.propTypes = {
  style: PropTypes.any,
  savingsByMonths: PropTypes.arrayOf(PropTypes.number),
  selectedMonthIndex: PropTypes.number,
  onMonthSelected: PropTypes.func.isRequired,
  total: PropTypes.number,
  allTimeYearAverage: PropTypes.number,
  allTimeTotalSavingsAndInvestments: PropTypes.number,
  previousYearTotalSavingsAndInvestments: PropTypes.number,
  previousYear: PropTypes.number,
};

export default function YearChart (props) {
  const {
    style,
    savingsByMonths,
    selectedMonthIndex,
    onMonthSelected,
    total,
    allTimeYearAverage,
    allTimeTotalSavingsAndInvestments,
    previousYearTotalSavingsAndInvestments,
    previousYear,
  } = props;

  const chartRef = useRef();

  const windowWidth = useSelector(state => state.ui.windowWidth);

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
      style={[styles.yearChart, style]}
      ref={chartRef}
      onLayout={onLayout}
    >
      <View
        style={styles.chartContainer}
        ref={chartRef}
        onLayout={onLayout}
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
          data={savingsByMonths}
          getColor={(opacity = 1) => `rgba(42, 113, 40, ${opacity})`} // COLOR.GREEN
          barSelected={selectedMonthIndex}
          onBarSelected={onMonthSelected}
        />

        <YearChartLegend
          chartWidth={chartWidth}
          selectedMonthIndex={selectedMonthIndex}
        />
      </View>

      {windowWidth >= MEDIA.DESKTOP && (
        <CompareStats
          style={styles.compareStats}
          compareWhat={total}
          compareTo={allTimeTotalSavingsAndInvestments}
          previousResult={previousYearTotalSavingsAndInvestments}
          previousResultName={`${previousYear}`}
          allTimeAverage={allTimeYearAverage}
          showSecondaryComparisons
          circleSubText='of income'
          circleSubTextColor={COLOR.GRAY}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  yearChart: {
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
    marginTop: 72,
  },

  compareStats: {
    marginTop: 52,
  },
});
