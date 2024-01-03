import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions, Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

MonthChartLegend.propTypes = {
  style: PropTypes.any,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  daysInMonth: PropTypes.number,
};

const LEGEND_HEIGHT = 16;

export default function MonthChartLegend (props) {
  const {
    style,
    chartWidth,
    chartHeight,
    daysInMonth,
  } = props;

  const [horizontalLineWidth, setHorizontalLineWidth] = useState(0);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  function onHorizontalLineLayout (event) {
    const { width } = event.nativeEvent.layout;

    const updatedWindowWidth = Dimensions.get('window').width;

    const horizontalLineWidthAdjustment = updatedWindowWidth < MEDIA.MEDIUM_DESKTOP
      ? updatedWindowWidth < MEDIA.DESKTOP
        ? updatedWindowWidth < MEDIA.TABLET
          ? updatedWindowWidth > MEDIA.WIDE_MOBILE
            ? (width * 0.005)
            : (width * 0.01)
          : -(width * 0.01)
        : 2
      : 1;

    setHorizontalLineWidth(width + horizontalLineWidthAdjustment);
  }

  const weekPaddingLeft = windowWidth < (MEDIA.MEDIUM_DESKTOP + (40 * 2)) ? 0 : 4;

  return (
    <View
      style={[styles.monthChartLegend, {
        width: Platform.OS === 'web' ? chartWidth : '100%',
        top: Platform.OS === 'web'
          ? chartHeight + LEGEND_HEIGHT
          : (chartWidth / 21 * 9) + 11,
        paddingRight: Platform.OS === 'web'
          ? 0
          : windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
            ? 17
            : 20,
      }, style]}
    >
      <View
        style={styles.horizontalLineContainer}
        onLayout={Platform.OS === 'web' ? undefined : onHorizontalLineLayout}
      >
        <View style={[styles.horizontalLine, Platform.OS !== 'web' && {
          width: horizontalLineWidth,
        }]} />
      </View>

      <View style={styles.weeks}>
        <View style={[styles.week, { flexGrow: 7, paddingLeft: weekPaddingLeft }]}>
          <Text style={styles.label}>Week 1</Text>
        </View>

        <View style={[styles.week, { flexGrow: 7, paddingLeft: weekPaddingLeft }]}>
          <Text style={styles.label}>Week 2</Text>
        </View>

        <View style={[styles.week, { flexGrow: 7, paddingLeft: weekPaddingLeft }]}>
          <Text style={styles.label}>Week 3</Text>
        </View>

        <View style={[styles.week, { flexGrow: 7 + (daysInMonth - 28), borderRightWidth: 0, paddingLeft: 0 }]}>
          <Text style={styles.label}>Week 4</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthChartLegend: {
    flexGrow: 1,
    paddingLeft: 65,
    position: 'absolute',
    left: 0,
    boxSizing: 'content-box',
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
