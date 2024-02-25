import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import YearChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/YearChartLegend';
import CompareStats from '../../../../components/CompareStats';
import { MEDIA } from '../../../../styles/media';
import { COLOR } from '../../../../styles/colors';

YearChart.propTypes = {
  style: PropTypes.any,
  incomesByMonths: PropTypes.arrayOf(PropTypes.number),
  selectedMonthIndex: PropTypes.number,
  onMonthSelected: PropTypes.func.isRequired,
  yearIncomesTotal: PropTypes.number.isRequired,
  previousYearTotalIncomes: PropTypes.number,
  previousYear: PropTypes.number,
  allTimeYearAverage: PropTypes.number,
  allTimeTotalIncome: PropTypes.number,
  showSecondaryComparisons: PropTypes.bool.isRequired,
};

export default function YearChart (props) {
  const {
    style,
    incomesByMonths,
    selectedMonthIndex,
    onMonthSelected,
    yearIncomesTotal,
    previousYearTotalIncomes,
    previousYear,
    allTimeYearAverage,
    allTimeTotalIncome,
    showSecondaryComparisons,
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
    <View style={[styles.monthChart, style]}>
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
          style={[
            styles.chart,
            windowWidth < MEDIA.WIDE_MOBILE && styles.chartMobile,
            windowWidth >= MEDIA.WIDE_MOBILE && windowWidth < MEDIA.TABLET && styles.chartTablet,
          ]}
          width={chartWidth}
          height={chartHeight}
          legendHeight={LEGEND_HEIGHT}
          data={incomesByMonths}
          getColor={(opacity = 1) => `rgba(238, 167, 76, ${opacity})`} // COLOR.MEDIUM_ORANGE
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
          compareWhat={yearIncomesTotal}
          compareTo={allTimeTotalIncome}
          previousResult={previousYearTotalIncomes}
          previousResultName={`${previousYear}`}
          allTimeAverage={allTimeYearAverage}
          showSecondaryComparisons={showSecondaryComparisons}
          circleSubText='of income'
          circleSubTextColor={COLOR.GRAY}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  monthChart: {
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
    marginTop: 100,
  },
  chartMobile: {
    marginTop: 180,
  },
  chartTablet: {
    marginTop: 136,
  },

  compareStats: {
    marginTop: 52,
  },
});
