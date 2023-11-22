import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart/MonthChart';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';

OverviewMonth.propTypes = {
  style: PropTypes.object,
  monthNumber: PropTypes.number,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
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
  const {
    style,
    monthNumber,
    expenses = {},
    incomes = {},
    savings = {},
    investments = {},
  } = props;

  const navigation = useNavigation();

  const [subtitleHighlighted, setSubtitleHighlighted] = useState(false);

  function formatAmount (number) {
    return `${Math.sign(number) === -1 ? '- ' : '+'}${parseFloat(Math.abs(number).toFixed(2)).toLocaleString()}`;
  }

  function getTotalAmount (items) {
    return Object
      .keys(items)
      .flatMap(week => {
        return (items[week] || []).reduce((total, item) => {
          const amount = item.amount || (item.shares * item.pricePerShare);
          return total + amount;
        }, 0);
      })
      .reduce((total, weekTotal) => total + weekTotal, 0);
  }

  function getAmountColor (amount) {
    const isPositive = amount >= 0;

    return isPositive ? COLOR.GREEN : COLOR.RED;
  }

  const totalIncomes = getTotalAmount(incomes);
  const totalExpenses = getTotalAmount(expenses);
  const totalSavingsAndInvestments = (getTotalAmount(savings) + getTotalAmount(investments)) || 0;
  const savingsPercent = Math.floor(totalSavingsAndInvestments * 100 / totalIncomes);

  const totalExcludingSavings = totalIncomes - totalExpenses;
  const total = totalExcludingSavings - totalSavingsAndInvestments;

  const totalExcludingSavingsColor = getAmountColor(totalExcludingSavings);
  const totalColor = getAmountColor(total);

  return (
    <View style={[styles.overviewMonth, style]}>
      <Pressable
        style={({ pressed }) => [styles.subtitleLink, pressed && styles.subtitlePressed]}
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
        <MonthChart style={styles.chart} />

        <View style={styles.stats}>
          {totalIncomes && (
            <View style={styles.statRow}>
              <Text style={styles.statName}>Income</Text>
              <Text style={styles.statValue}>{formatAmount(totalIncomes)}</Text>
            </View>
          )}

          {totalExpenses && (
            <View style={styles.statRow}>
              <Text style={styles.statName}>Expenses</Text>
              <Text style={styles.statValue}>{formatAmount(-totalExpenses)}</Text>
            </View>
          )}

          {totalSavingsAndInvestments && (
            <View style={styles.statRow}>
              <Text style={styles.statName}>Savings</Text>
              <Text style={styles.statValue}>{formatAmount(totalSavingsAndInvestments)}</Text>
            </View>
          )}

          {savingsPercent && (
            <View style={[styles.statRow, { marginTop: 12 }]}>
              <Text style={[styles.statValue, styles.smallerText]}>({savingsPercent}%)</Text>
            </View>
          )}

          <View style={styles.underline} />

          {totalSavingsAndInvestments && (
            <View style={styles.statRow}>
              <Text style={[styles.statName, styles.smallerText]}>(Excluding Savings)</Text>
              <Text style={[styles.statValue, styles.statValueBold, { color: totalExcludingSavingsColor }]}>
                {formatAmount(totalExcludingSavings)}
              </Text>
            </View>
          )}

          <View style={styles.statRow}>
            <Text style={[styles.statName, styles.statNameBold, { color: totalColor }]}>
              Total
            </Text>
            <Text style={[styles.statValue, styles.statValueBold, { color: totalColor }]}>
              {formatAmount(total)}
            </Text>
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

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleContainer: {
    paddingVertical: 6,
    borderStyle: Platform.select({ web: 'dashed' }),
    borderBottomWidth: 3,
    borderBottomColor: COLOR.TRANSPARENT,
  },
  subtitle: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 40,
    lineHeight: 40,
    color: COLOR.DARK_GRAY,
  },
  subtitlePressed: {
    opacity: 0.7,
  },
  subtitleNumberPositive: {
    color: COLOR.GREEN,
  },
  subtitleNumberNegative: {
    color: COLOR.RED,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  chart: {
    width: '50%',
    marginTop: 40,
    marginLeft: -58,
  },

  stats: {
    width: '50%',
    paddingTop: 50,
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
  statNameBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
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
    fontSize: 16,
    lineHeight: 30,
  },

  underline: {
    height: 1,
    marginTop: 12,
    marginLeft: '50%',
    backgroundColor: COLOR.BLACK,
  },
});
