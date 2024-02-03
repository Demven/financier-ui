import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';
import { MONTH_NAME, MONTHS_IN_YEAR } from '../../../../services/date';

YearChartLegend.propTypes = {
  style: PropTypes.any,
  chartWidth: PropTypes.number,
  selectedMonthIndex: PropTypes.number,
};

export const LEGEND_HEIGHT = 18;
const BORDER_WIDTH = 2;

export default function YearChartLegend (props) {
  const {
    style,
    chartWidth,
    selectedMonthIndex,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View style={[styles.yearChartLegend, {
      bottom: windowWidth < MEDIA.WIDE_MOBILE ? 2 : 0,
    }, style]}>
      <View style={styles.horizontalLineContainer}>
        <View style={styles.horizontalLine} />
      </View>

      <View style={styles.months}>
        {Array.from(new Array(MONTHS_IN_YEAR)).map((_, index) => (
          <View
            key={index}
            style={[
              styles.month,
              { width: chartWidth / MONTHS_IN_YEAR },
              index === MONTHS_IN_YEAR - 1 && { borderRightWidth: 0, paddingLeft: 0 },
            ]}
          >
            <Text style={[
              styles.label,
              {
                fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 10 : 12,
                lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 10 : 12,
              },
              selectedMonthIndex === index && styles.labelSelected,
            ]}>
              {MONTH_NAME[index + 1].substring(0, 3)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  yearChartLegend: {
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

  months: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
  },

  month: {
    transform: [{ translateX: BORDER_WIDTH / 2 }],
    paddingTop: 4,
    borderRightWidth: 2,
    borderRightColor: COLOR.LIGHT_GRAY,
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
