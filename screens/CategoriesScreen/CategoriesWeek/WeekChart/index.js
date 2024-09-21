import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import DonutChart from '../../../../components/chart/DonutChart';
import BarChart from '../../../../components/chart/BarChart';
import WeekChartLegend, { LEGEND_HEIGHT } from '../../../../components/chart/legends/WeekChartLegend';
import { MEDIA } from '../../../../styles/media';
import { COLOR } from '../../../../styles/colors';
import { FONT } from '../../../../styles/fonts';

WeekChart.propTypes = {
  style: PropTypes.any,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    colorId: PropTypes.string.isRequired,
  })).isRequired,
  dayExpensesTotalsGroupedByCategoryId: PropTypes.object.isRequired, // { [1]: { id1: 100, id2: 200 }, [2]: {} ...}
  expensesTotalsGroupedByCategoryId: PropTypes.object.isRequired, // { id1: 100, id2: 200 }
  daysInWeek: PropTypes.number.isRequired,
  weekTotal: PropTypes.number.isRequired,
  selectedCategoryId: PropTypes.number,
  onSelectCategoryId: PropTypes.func,
};

export default function WeekChart (props) {
  const {
    style,
    categories,
    dayExpensesTotalsGroupedByCategoryId,
    expensesTotalsGroupedByCategoryId,
    daysInWeek,
    weekTotal,
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

  const chartData = categories
    .map(category => {
      const { red, green, blue, intensity } = colors.find(color => color.id === category.colorId);
      const value = expensesTotalsGroupedByCategoryId[category.id];

      if (!value) {
        return null;
      }

      return {
        id: category.id,
        value: value * 100 / weekTotal,
        absoluteValue: value,
        label: category.name,
        textColor: intensity === 'light' ? COLOR.DARK_GRAY : COLOR.WHITE,
        getColor: (opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`,
      };
    })
    .filter(Boolean);

  const selectedChartSegment = chartData.find(category => category.id === selectedCategoryId);

  const categoryExpensesByDays = Array.from(new Array(daysInWeek))
    .map((_, index) => dayExpensesTotalsGroupedByCategoryId[index][selectedCategoryId] || 0);

  const selectedSegmentTextFontSize = windowWidth > MEDIA.DESKTOP && windowWidth < MEDIA.MEDIUM_DESKTOP
    ? 28  // desktop
    : windowWidth < MEDIA.TABLET
      ? 24 // mobile
      : windowWidth < MEDIA.DESKTOP
        ? 28 // tablet
        : 30; // wide desktop
  const selectedSegmentLineHeight = windowWidth > MEDIA.DESKTOP && windowWidth < MEDIA.MEDIUM_DESKTOP
    ? 32 // desktop
    : windowWidth < MEDIA.TABLET
      ? 28 // mobile
      : windowWidth < MEDIA.DESKTOP
        ? 32 // tablet
        : 34; // wide desktop

  return (
    <View style={[styles.weekChart, style]}>
      <Loader
        style={styles.loader}
        loading={loading}
        setLoading={setLoading}
        timeout={500}
      />

      {selectedChartSegment && (
        <View style={[
          styles.selectedChartSegmentTextContainer,
          windowWidth < MEDIA.DESKTOP && styles.selectedChartSegmentTextContainerTabletMobile,
        ]}>
          <Text style={[
            styles.selectedChartSegmentText,
            windowWidth < MEDIA.DESKTOP && styles.selectedChartSegmentTextTabletMobile,
            {
              fontSize: selectedSegmentTextFontSize,
              lineHeight: selectedSegmentLineHeight,
            },
          ]}>
            {selectedChartSegment.label} ({selectedChartSegment?.value?.toFixed(2)}%)
          </Text>
        </View>
      )}

      <DonutChart
        style={[styles.chart, windowWidth < MEDIA.TABLET && styles.chartMobile]}
        data={chartData}
        selectedSegmentId={selectedCategoryId}
        onSelectSegment={onSelectCategoryId}
      />

      {selectedChartSegment && (
        <View style={[styles.barChartContainer, windowWidth < MEDIA.TABLET && styles.barChartContainerMobile]}>
          <View
            style={[
              styles.selectedChartSegmentTextContainer,
              windowWidth < MEDIA.DESKTOP && styles.selectedChartSegmentTextContainerTabletMobile,
            ]}
          >
            <Text
              style={[
                styles.selectedChartSegmentText,
                windowWidth < MEDIA.DESKTOP && styles.selectedChartSegmentTextTabletMobile,
                {
                  fontSize: selectedSegmentTextFontSize,
                  lineHeight: selectedSegmentLineHeight,
                },
              ]}
            >
              {selectedChartSegment.label} (by weeks)
            </Text>
          </View>

          <View
            style={[
              styles.barChartWrapper,
              windowWidth < MEDIA.DESKTOP && styles.barChartWrapperTabletMobile,
            ]}
            onLayout={onBarChartLayout}
          >
            <BarChart
              style={[styles.barChart, windowWidth < MEDIA.DESKTOP && styles.barChartTabletMobile]}
              width={barChartWidth}
              height={300}
              legendHeight={LEGEND_HEIGHT}
              data={categoryExpensesByDays}
              getColor={selectedChartSegment.getColor}
            />

            <WeekChartLegend daysInWeek={daysInWeek} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weekChart: {
    flexGrow: 1,
    position: 'relative',
  },

  loader: {
    marginTop: 32,
  },

  chart: {
    width: '100%',
    marginTop: 52,
  },
  chartMobile: {
    marginTop: 32,
  },

  barChartContainer: {
    position: 'relative',
  },
  barChartContainerMobile: {
    paddingHorizontal: 16,
  },

  selectedChartSegmentTextContainer: {
    marginTop: 42,
    marginLeft: 28,
  },
  selectedChartSegmentTextContainerTabletMobile: {
    marginLeft: 0,
  },
  selectedChartSegmentText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.DARK_GRAY,
  },
  selectedChartSegmentTextTabletMobile: {
    textAlign: 'center',
  },

  barChartWrapper: {
    marginLeft: 28,
  },
  barChartWrapperTabletMobile: {
    marginLeft: 0,
  },

  barChart: {
    marginTop: 72,
  },
  barChartTabletMobile: {
    marginTop: 56,
  },
});
