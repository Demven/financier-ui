import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import RadialChart from '../../../../components/chart/RadialChart';
import BarChart from '../../../../components/chart/BarChart';
import MonthChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/MonthChartLegend';
import { DAYS_IN_WEEK, WEEKS_IN_MONTH } from '../../../../services/date';
import { MEDIA } from '../../../../styles/media';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';

MonthChart.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    colorId: PropTypes.string.isRequired,
  })).isRequired,
  weekExpensesTotalsGroupedByCategoryId: PropTypes.object.isRequired, // { [1]: { id1: 100, id2: 200 }, [2]: {} ...}
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired, // { id1: 100, id2: 200 }
  daysNumber: PropTypes.number.isRequired,
  monthTotal: PropTypes.number.isRequired,
  selectedCategoryId: PropTypes.string,
  onSelectCategoryId: PropTypes.func,
};

export default function MonthChart (props) {
  const {
    style,
    categories,
    weekExpensesTotalsGroupedByCategoryId,
    expensesTotalsGroupedByCategoryId,
    monthTotal,
    daysNumber,
    selectedCategoryId,
    onSelectCategoryId,
  } = props;

  const [loading, setLoading] = useState(true);
  const [barChartWidth, setBarChartWidth] = useState(0);

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const colors = useSelector(state => state.colors);

  function onBarChartLayout (event) {
    const { width } = event.nativeEvent.layout;

    setBarChartWidth(width);
  }

  const chartData = categories.map(category => {
    const { red, green, blue, intensity } = colors.find(color => color.id === category.colorId);

    return {
      id: category.id,
      value: expensesTotalsGroupedByCategoryId[category.id] * 100 / monthTotal,
      label: category.name,
      textColor: intensity === 'light' ? COLOR.DARK_GRAY : COLOR.WHITE,
      getColor: (opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`,
    };
  });

  const selectedChartSegment = chartData.find(category => category.id === selectedCategoryId);

  const categoriesByWeeks = [
    weekExpensesTotalsGroupedByCategoryId[1][selectedCategoryId] || 0,
    weekExpensesTotalsGroupedByCategoryId[2][selectedCategoryId] || 0,
    weekExpensesTotalsGroupedByCategoryId[3][selectedCategoryId] || 0,
    weekExpensesTotalsGroupedByCategoryId[4][selectedCategoryId] || 0,
  ];

  return (
    <View style={[styles.monthChart, style]}>
      <Loader
        style={styles.loader}
        loading={loading}
        setLoading={setLoading}
        timeout={500}
      />

      <RadialChart
        style={[styles.chart, windowWidth < MEDIA.TABLET && styles.chartMobile]}
        data={chartData}
        selectedSegmentId={selectedCategoryId}
        onSelectSegment={onSelectCategoryId}
      />

      <View
        style={styles.barChartContainer}
        onLayout={onBarChartLayout}
      >
        {selectedChartSegment && (
          <>
            <View style={styles.selectedChartSegmentTextContainer}>
              <Text style={styles.selectedChartSegmentText}>
                {selectedChartSegment.label} ({Math.round(selectedChartSegment.value)}%)
              </Text>
            </View>

            <BarChart
              style={styles.barChart}
              width={barChartWidth}
              height={300}
              legendHeight={LEGEND_HEIGHT}
              data={categoriesByWeeks}
              barsProportion={[
                DAYS_IN_WEEK,
                DAYS_IN_WEEK,
                DAYS_IN_WEEK,
                DAYS_IN_WEEK + (daysNumber - DAYS_IN_WEEK * WEEKS_IN_MONTH),
              ]}
              getColor={selectedChartSegment.getColor}
            />

            <MonthChartLegend
              width={barChartWidth}
              daysInMonth={daysNumber}
              barsProportion={[
                DAYS_IN_WEEK,
                DAYS_IN_WEEK,
                DAYS_IN_WEEK,
                DAYS_IN_WEEK + (daysNumber - DAYS_IN_WEEK * WEEKS_IN_MONTH),
              ]}
            />
          </>
        )}
      </View>
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
  },
  chartMobile: {
    marginTop: 40,
  },

  barChartContainer: {
    marginTop: 52,
    marginLeft: 32,
    position: 'relative',
  },

  selectedChartSegmentTextContainer: {},
  selectedChartSegmentText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 24,
    lineHeight: 32,
    color: COLOR.DARK_GRAY,
  },

  barChart: {
    marginTop: 72,
  },
});
