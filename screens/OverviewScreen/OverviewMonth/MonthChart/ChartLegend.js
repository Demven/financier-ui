import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from "../../../../styles/media";

ChartLegend.propTypes = {
  style: PropTypes.any,
  daysInMonth: PropTypes.number,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  month: PropTypes.bool,
};

export default function ChartLegend (props) {
  const {
    style,
    daysInMonth,
    month,
  } = props;

  const [legendWidth, setLegendWidth] = useState(0);
  const [horizontalLineWidth, setHorizontalLineWidth] = useState(0);

  const chartLegendRef = useRef();
  const horizontalLineRef = useRef();

  useEffect(() => {
    onResizeLegend();
  }, [chartLegendRef?.current]);

  function onResizeLegend () {
    if (chartLegendRef?.current?.offsetWidth) {
      setLegendWidth(chartLegendRef.current.offsetWidth);
    }
  }

  function onResizeHorizontalLine () {
    if (horizontalLineRef?.current?.offsetWidth) {
      setHorizontalLineWidth(horizontalLineRef.current.offsetWidth);
    }
  }

  const screenWidth = Dimensions.get('window').width;

  console.info('screenWidth', screenWidth);

  const weekPaddingLeft = screenWidth < (MEDIA.MEDIUM_DESKTOP + 40*2) ? 0 : 4;

  return (
    <View
      style={[
        styles.chartLegend,
        {
          top: (legendWidth / 21 * 9) + 11,
          paddingRight: screenWidth < (MEDIA.MEDIUM_DESKTOP + 40*2) ? 17 : 20,
        },
        style,
      ]}
      ref={chartLegendRef}
      onLayout={onResizeLegend}
    >
      <View
        style={styles.horizontalLineContainer}
        ref={horizontalLineRef}
        onLayout={onResizeHorizontalLine}
      >
        <View style={[styles.horizontalLine, {
          width: horizontalLineWidth + (screenWidth < MEDIA.MEDIUM_DESKTOP ? (screenWidth < MEDIA.DESKTOP ? 4 : 2) : 1)
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
