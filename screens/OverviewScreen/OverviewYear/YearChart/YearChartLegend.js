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
import { MONTH_NAME } from '../../../../services/date';

YearChartLegend.propTypes = {
  style: PropTypes.any,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
};

const LEGEND_HEIGHT = 16;
const MONTHS_IN_YEAR = 12;

export default function YearChartLegend (props) {
  const {
    style,
    chartWidth,
    chartHeight,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  return (
    <View
      style={[styles.yearChartLegend, {
        width: Platform.OS === 'web' ? chartWidth : '100%',
        top: Platform.OS === 'web'
          ? chartHeight + LEGEND_HEIGHT
          : (chartWidth / 21 * 9) + 12,
        paddingRight: Platform.OS === 'web'
          ? 0
          : windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
            ? 100
            : 20,
      }, style]}
    >
      <View style={styles.horizontalLineContainer}>
        <View style={styles.horizontalLine} />
      </View>

      <View style={styles.months}>
        {Array.from(new Array(MONTHS_IN_YEAR)).map((_, index) => (
          <View
            key={index}
            style={[
              styles.month,
              index === MONTHS_IN_YEAR - 1 && { borderRightWidth: 0, paddingLeft: 0 },
            ]}
          >
            <Text style={styles.label}>
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

  months: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
  },

  month: {
    flexGrow: 1,
    paddingTop: 4,
    paddingLeft: 0,
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
