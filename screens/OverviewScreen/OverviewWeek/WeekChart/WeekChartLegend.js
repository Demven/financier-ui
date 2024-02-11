import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

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

  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View
      style={[styles.weekChartLegend, {
        width: Platform.OS === 'web' ? chartWidth : '100%',
        top: Platform.OS === 'web'
          ? chartHeight + LEGEND_HEIGHT
          : (chartWidth / 21 * 9) + 12,
        paddingRight: Platform.OS === 'web'
          ? 0
          : windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
            ? daysInWeek > 7 ? 94 : 112
            : 20,
      }, style]}
    >
      <View style={styles.horizontalLineContainer}>
        <View style={styles.horizontalLine} />
      </View>

      <View style={styles.days}>
        {Array.from(new Array(daysInWeek)).map((_, index) => (
          <View
            key={index}
            style={[
              styles.day,
              {
                paddingLeft: daysInWeek > 7 ? 2 : 0,
              },
              index === daysInWeek - 1 && { borderRightWidth: 0, paddingLeft: 0 },
            ]}
          >
            <Text style={styles.label}>
              {windowWidth > MEDIA.WIDE_MOBILE ? 'Day ' : ''}{index + 1}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekChartLegend: {
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

  days: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
  },

  day: {
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
