import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import RadialChart from '../../../../components/chart/RadialChart';
import { MEDIA } from '../../../../styles/media';

MonthChart.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    colorId: PropTypes.string.isRequired,
  })).isRequired,
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired,
  monthTotal: PropTypes.number.isRequired,
  selectedCategoryId: PropTypes.number,
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
    const { red, green, blue } = colors.find(color => color.id === category.colorId);

    return {
      id: category.id,
      value: expensesTotalsGroupedByCategoryId[category.id] * 100 / monthTotal,
      label: category.name,
      getColor: (opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`,
    };
  });

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
    marginTop: 80,
  },
  chartMobile: {
    marginTop: 180,
  },
});
