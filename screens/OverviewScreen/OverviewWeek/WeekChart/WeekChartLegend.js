import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';

WeekChartLegend.propTypes = {
  style: PropTypes.any,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  daysInWeek: PropTypes.number,
};

const LEGEND_HEIGHT = 16;

export default function WeekChartLegend (props) {
  const {
    style,
    chartWidth,
    chartHeight,
    daysInWeek,
  } = props;

  return (
    <View
      style={[
        styles.weekChartLegend,
        {
          width: chartWidth,
          top: chartHeight + LEGEND_HEIGHT,
        },
        style,
      ]}
    >
      <View style={styles.horizontalLineContainer}>
        <View style={styles.horizontalLine} />
      </View>

      <View style={styles.weeks}>
        {Array.from(new Array(daysInWeek)).map((_, index) => (
          <View
            style={[
              styles.week,
              {
                paddingLeft: daysInWeek > 7 ? 2 : 0,
              },
              index === daysInWeek - 1 && { borderRightWidth: 0, paddingLeft: 0 },
            ]}
          >
            <Text style={styles.label}>
              Day {index + 1}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekChartLegend: {
    width: '100%',
    flexGrow: 1,
    marginLeft: 65,
    position: 'absolute',
    left: 0,
  },

  horizontalLineContainer: {
    width: '100%',
    height: 2,
    position: 'relative',
  },
  horizontalLine: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.LIGHT_GRAY,
    position: 'absolute',
    left: -1,
    top: 0,
  },

  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: COLOR.LIGHT_GRAY,
    position: 'absolute',
    top: -4,
  },

  weeks: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
  },

  week: {
    flexGrow: 1,
    paddingTop: 4,
    borderRightWidth: 2,
    borderRightColor: COLOR.LIGHT_GRAY,
  },

  label: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 12,
    lineHeight: 12,
    color: COLOR.LIGHT_GRAY,
    textAlign: 'center',
  },
});
