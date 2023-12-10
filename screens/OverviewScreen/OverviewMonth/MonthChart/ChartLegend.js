import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

ChartLegend.propTypes = {
  style: PropTypes.any,
  daysInMonth: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
};

export default function ChartLegend (props) {
  const {
    style,
    daysInMonth,
  } = props;

  const [legendWidth, setLegendWidth] = useState(0);
  const [horizontalLineWidth, setHorizontalLineWidth] = useState(0);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  function onChartLegendLayout (event) {
    const { width } = event.nativeEvent.layout;

    setLegendWidth(width);
  }

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

  const weekPaddingLeft = windowWidth < (MEDIA.MEDIUM_DESKTOP + 40*2) ? 0 : 4;

  return (
    <View
      style={[
        styles.chartLegend,
        {
          top: (legendWidth / 21 * 9) + 11,
          paddingRight: windowWidth < (MEDIA.MEDIUM_DESKTOP + 40*2) ? 17 : 20,
        },
        style,
      ]}
      onLayout={onChartLegendLayout}
    >
      <View
        style={styles.horizontalLineContainer}
        onLayout={onHorizontalLineLayout}
      >
        <View style={[styles.horizontalLine, {
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
  chartLegend: {
    width: '100%',
    flexGrow: 1,
    paddingLeft: 65,
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
