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
    color: PropTypes.shape({
      red: PropTypes.number,
      green: PropTypes.number,
      blue: PropTypes.number,
    })
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

  const chartRef = useRef();

  const chartData = categories.map(category => ({
    id: category.id,
    value: expensesTotalsGroupedByCategoryId[category.id] * 100 / monthTotal,
    label: category.name,
    getColor: (opacity = 1) => `rgba(${category.color.red}, ${category.color.green}, ${category.color.blue}, ${opacity})`,
    selected: selectedCategoryId === category.id,
  }));

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
