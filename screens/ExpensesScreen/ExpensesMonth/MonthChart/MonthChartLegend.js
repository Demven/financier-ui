import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { WEEKS_IN_MONTH, DAYS_IN_WEEK } from '../../../../services/date';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

MonthChartLegend.propTypes = {
  style: PropTypes.any,
  width: PropTypes.number,
  daysInMonth: PropTypes.number,
  selectedWeekIndex: PropTypes.number,
  barsProportion: PropTypes.arrayOf(PropTypes.number),
};

export const LEGEND_HEIGHT = 18;
const BORDER_WIDTH = 2;

export default function MonthChartLegend (props) {
  const {
    style,
    width,
    daysInMonth,
    selectedWeekIndex,
    barsProportion,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View
      style={[styles.monthChartLegend, {
        bottom: windowWidth < MEDIA.WIDE_MOBILE ? 2 : 0,
      }, style]}
    >
      <View style={styles.horizontalLineContainer}>
        <View style={styles.horizontalLine} />
      </View>

      <View style={styles.weeks}>
        {Array.from(new Array(WEEKS_IN_MONTH)).map((_, index) => {
          const isLastWeek = index === WEEKS_IN_MONTH - 1;

          return (
            <View
              key={index}
              style={[
                styles.week,
                isLastWeek && styles.weekLast,
                { width: width / daysInMonth * (barsProportion?.[index] || DAYS_IN_WEEK) },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  selectedWeekIndex === index && styles.labelSelected,
                ]}
              >
                Week {index + 1}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthChartLegend: {
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

  weeks: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
  },

  week: {
    transform: [{ translateX: BORDER_WIDTH / 2 }],
    paddingTop: 4,
    borderRightWidth: 2,
    borderRightColor: COLOR.LIGHT_GRAY,
  },
  weekLast: {
    borderRightWidth: 0,
    paddingLeft: 0,
  },

  label: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    color: COLOR.LIGHT_GRAY,
    textAlign: 'center',
  },
  labelSelected: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    color: COLOR.DARK_GRAY,
  },
});
