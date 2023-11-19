import {
  StyleSheet,
  View,
  Text,
  Pressable, Platform, Image,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';

OverviewMonth.propTypes = {
  style: PropTypes.object,
  monthNumber: PropTypes.number,
  expenses: PropTypes.object.isRequired, // weeks -> days -> expenses { [1]: { [1]: [], [2]: [] } }
};

const MONTH_NAME = {
  [1]: 'January',
  [2]: 'February',
  [3]: 'March',
  [4]: 'April',
  [5]: 'May',
  [6]: 'June',
  [7]: 'July',
  [8]: 'August',
  [9]: 'September',
  [10]: 'October',
  [11]: 'November',
  [12]: 'December',
};

export default function OverviewMonth (props) {
  const { style, monthNumber, expenses } = props;

  const navigation = useNavigation();

  const [subtitleHighlighted, setSubtitleHighlighted] = useState(false);

  const week1 = expenses[1] || {};
  const week2 = expenses[2] || {};
  const week3 = expenses[3] || {};
  const week4 = expenses[4] || {};

  return (
    <View style={[styles.overviewMonth, style]}>
      <Pressable
        style={({ pressed }) => [pressed && styles.subtitlePressed]}
        onPress={() => navigation.navigate('OverviewWeeks', { monthNumber })}
      >
        <View
          style={[
            styles.subtitleContainer,
            subtitleHighlighted && { borderBottomColor: COLOR.BLACK }
          ]}
        >
          <Text
            style={styles.subtitle}
            onMouseEnter={() => setSubtitleHighlighted(true)}
            onMouseLeave={() => setSubtitleHighlighted(false)}
          >
            {MONTH_NAME[monthNumber]}
          </Text>
        </View>
      </Pressable>

      <View style={styles.content}>
        <Image
          style={styles.chart}
          source={require('../../../assets/images/charts/chart-months.jpg')}
          resizeMode='cover'
        />

        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text style={styles.statName}>Income</Text>
            <Text style={styles.statValue}>+12,092.00</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statName}>Expenses</Text>
            <Text style={styles.statValue}>–8,345.29</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statName}>Savings</Text>
            <Text style={styles.statValue}>+1,200.30</Text>
          </View>

          <View style={[styles.statRow, { marginTop: 12 }]}>
            <Text style={[styles.statValue, styles.smallerText]}>(12.3%)</Text>
          </View>

          <View style={styles.underline} />

          <View style={styles.statRow}>
            <Text style={styles.statName}>Total</Text>
            <Text style={styles.statValue}>+3,746.71</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statName, styles.smallerText]}>(Excluding Savings)</Text>
            <Text style={[styles.statValue, styles.statValueBold]}>+2,546.41</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewMonth: {
    flexGrow: 1,
  },

  subtitleContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    borderStyle: Platform.select({ web: 'dashed' }),
    borderBottomWidth: 3,
    borderBottomColor: COLOR.TRANSPARENT,
  },
  subtitle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    fontSize: 32,
    lineHeight: 36,
  },
  subtitlePressed: {
    opacity: 0.7,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  chart: {
    width: 494,
    height: 278,
    marginTop: 40,
  },

  stats: {
    width: '50%',
    paddingLeft: 40,
  },
  statRow: {
    marginTop: 20,
    flexDirection: 'row',
  },
  statName: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 24,
    lineHeight: 30,
    color: COLOR.DARK_GRAY,
  },
  statValue: {
    marginLeft: 'auto',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 24,
    lineHeight: 30,
    color: COLOR.DARK_GRAY,
  },
  statValueBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  smallerText: {
    fontSize: 18,
    lineHeight: 30,
  },

  underline: {
    height: 1,
    marginTop: 12,
    marginLeft: '50%',
    backgroundColor: COLOR.BLACK,
  },
});
