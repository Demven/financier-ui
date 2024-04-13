import { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import RadialChart from '../../../../components/chart/RadialChart';
import { MEDIA } from '../../../../styles/media';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';

MonthChart.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    colorId: PropTypes.string.isRequired,
  })).isRequired,
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  monthTotal: PropTypes.number.isRequired,
  selectedCategoryId: PropTypes.string,
  onSelectCategoryId: PropTypes.func,
};

export default function MonthChart (props) {
  const {
    style,
    categories,
    expensesTotalsGroupedByCategoryId,
    monthTotal,
    selectedCategoryId,
    onSelectCategoryId,
  } = props;

  const [loading, setLoading] = useState(true);

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const colors = useSelector(state => state.colors);

  const chartRef = useRef();

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

  return (
    <View
      style={[styles.monthChart, style]}
      ref={chartRef}
    >
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

      {!!selectedChartSegment && (
        <View style={styles.selectedChartSegmentTextContainer}>
          <Text style={styles.selectedChartSegmentText}>
            {selectedChartSegment.label} ({Math.round(selectedChartSegment.value)}%)
          </Text>
        </View>
      )}
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

  selectedChartSegmentTextContainer: {
    marginTop: 16,
    marginLeft: 32,
  },
  selectedChartSegmentText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 24,
    lineHeight: 32,
    color: COLOR.DARK_GRAY,
  },
});
