import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import BarChart from '../../../../components/chart/BarChart';
import YearChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/YearChartLegend';
import RadialChart from '../../../../components/chart/RadialChart';
import { MEDIA } from '../../../../styles/media';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';

YearChart.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    colorId: PropTypes.string.isRequired,
  })).isRequired,
  monthExpensesTotalsGroupedByCategoryId: PropTypes.object.isRequired, // { [1]: { id1: 100, id2: 200 }, [2]: {} ...}
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired, // { id1: 100, id2: 200 }
  yearTotal: PropTypes.number.isRequired,
  selectedCategoryId: PropTypes.string,
  onSelectCategoryId: PropTypes.func,
};

export default function YearChart (props) {
  const {
    style,
    categories,
    monthExpensesTotalsGroupedByCategoryId,
    expensesTotalsGroupedByCategoryId,
    yearTotal,
    selectedCategoryId,
    onSelectCategoryId,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const colors = useSelector(state => state.colors);

  const [loading, setLoading] = useState(true);
  const [barChartWidth, setBarChartWidth] = useState(0);

  function onBarChartLayout (event) {
    const { width } = event.nativeEvent.layout;

    setBarChartWidth(width);
  }

  const chartData = categories.map(category => {
    const { red, green, blue, intensity } = colors.find(color => color.id === category.colorId);

    return {
      id: category.id,
      value: expensesTotalsGroupedByCategoryId[category.id] * 100 / yearTotal,
      label: category.name,
      textColor: intensity === 'light' ? COLOR.DARK_GRAY : COLOR.WHITE,
      getColor: (opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`,
    };
  });

  const selectedChartSegment = chartData.find(category => category.id === selectedCategoryId);

  const categoriesByMonths = [
    monthExpensesTotalsGroupedByCategoryId[1][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[2][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[3][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[4][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[5][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[6][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[7][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[8][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[9][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[10][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[11][selectedCategoryId] || 0,
    monthExpensesTotalsGroupedByCategoryId[12][selectedCategoryId] || 0,
  ];

  return (
    <View style={[styles.yearChart, style]}>
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
        style={[styles.barChartContainer, {
          marginTop: windowWidth < MEDIA.DESKTOP ? 32 : 52,
        }]}
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
              data={categoriesByMonths}
              getColor={selectedChartSegment.getColor}
            />

            <YearChartLegend chartWidth={barChartWidth} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  yearChart: {
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
