import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';
import { MEDIA } from '../../../styles/media';

WeekChartLegend.propTypes = {
  style: PropTypes.any,
  daysInWeek: PropTypes.number,
  selectedDayIndex: PropTypes.number,
};

export const LEGEND_HEIGHT = 18;

export default function WeekChartLegend (props) {
  const {
    style,
    daysInWeek,
    selectedDayIndex,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View
      style={[styles.weekChartLegend, {
        bottom: windowWidth < MEDIA.WIDE_MOBILE ? 2 : 0,
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
              { paddingLeft: daysInWeek > 7 ? 2 : 0 },
              index === daysInWeek - 1 && { borderRightWidth: 0, paddingLeft: 0 },
            ]}
          >
            <Text
              style={[
                styles.label,
                selectedDayIndex === index && styles.labelSelected,
              ]}
            >
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
    width: '100%',
    flexGrow: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
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
  labelSelected: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.DARK_GRAY,
  },
});
