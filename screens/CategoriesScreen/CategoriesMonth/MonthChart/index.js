import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../../../../components/Loader';
import DonutChart from '../../../../components/chart/DonutChart';
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
  selectedCategoryId: PropTypes.number,
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
        value: value * 100 / monthTotal,
        absoluteValue: value,
        label: category.name,
        textColor: intensity === 'light' ? COLOR.DARK_GRAY : COLOR.WHITE,
        getColor: (opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`,
      };
    })
    .filter(Boolean);

  const selectedChartSegment = chartData.find(segment => segment.id === selectedCategoryId);

  const categoriesByWeeks = [
    weekExpensesTotalsGroupedByCategoryId[1][selectedCategoryId] || 0,
    weekExpensesTotalsGroupedByCategoryId[2][selectedCategoryId] || 0,
    weekExpensesTotalsGroupedByCategoryId[3][selectedCategoryId] || 0,
    weekExpensesTotalsGroupedByCategoryId[4][selectedCategoryId] || 0,
  ];

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
    <View style={[styles.monthChart, style]}>
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
              {selectedChartSegment.label} (by days)
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
          </View>
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
