import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '../../../../styles/fonts';
import { COLOR } from '../../../../styles/colors';

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

  return (
    <View style={[styles.chartLegend, style]}>
      <View style={styles.horizontalLine} />

      <View style={styles.weeks}>
        <View style={[styles.week, { flexGrow: 7 }]}>
          <Text style={styles.label}>Week 1</Text>
        </View>

        <View style={[styles.week, { flexGrow: 7 }]}>
          <Text style={styles.label}>Week 2</Text>
        </View>

        <View style={[styles.week, { flexGrow: 7 }]}>
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
    position: 'absolute',
    left: -2,
    bottom: -10,
  },

  horizontalLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLOR.LIGHT_GRAY,
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
    paddingLeft: 4,
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
