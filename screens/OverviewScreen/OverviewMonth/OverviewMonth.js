import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import MonthChart, { CHART_VIEW } from './MonthChart';
import TitleLink from '../../../components/TitleLink';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';
import { MEDIA } from '../../../styles/media';

OverviewMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
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
    year,
    monthNumber,
    expenses = {},
    incomes = {},
    savings = {},
    investments = {},
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [chartView, setChartView] = useState(CHART_VIEW.INCOME);

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

  const columnWidth = windowWidth < MEDIA.DESKTOP ? '100%' : '50%';
  const subtitleFontSize = windowWidth < MEDIA.DESKTOP ? 36 : 40;
  const subtitlePaddingLeft = windowWidth < MEDIA.DESKTOP ? 28 : 0;

  return (
    <View style={[styles.overviewMonth, style]}>
      <TitleLink
        style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
        textStyle={{ fontSize: subtitleFontSize }}
        onPress={() => navigation.navigate('OverviewWeeks', { monthNumber })}
      >
        {MONTH_NAME[monthNumber]}
      </TitleLink>

      <View style={[
        styles.content,
        {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        },
      ]}>
        <MonthChart
          style={[styles.chart, { width: columnWidth }]}
          year={year}
          chartView={chartView}
          setChartView={setChartView}
          monthNumber={monthNumber}
          expenses={expenses}
          incomes={incomes}
          savings={savings}
          investments={investments}
        />

        <View style={[
          styles.stats,
          {
            width: columnWidth,
            marginTop: windowWidth < MEDIA.DESKTOP ? -40 : 0,
            paddingTop: windowWidth < MEDIA.DESKTOP ? 0 : 48,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 32 : 40,
            paddingRight: windowWidth < MEDIA.DESKTOP ? 32 : 0,
          },
        ]}>
          {totalIncomes && (
            <View style={[styles.statRow, { marginTop: 0 }]}>
              <TitleLink
                textStyle={[styles.statName, chartView === CHART_VIEW.INCOME && styles.statNameBold]}
                underlineGap={2}
                onPress={() => setChartView(CHART_VIEW.INCOME)}
              >
                Income
              </TitleLink>

              <Text style={styles.statValue}>{formatAmount(totalIncomes)}</Text>
            </View>
          )}

          {totalExpenses && (
            <View style={styles.statRow}>
              <TitleLink
                textStyle={[styles.statName, chartView === CHART_VIEW.EXPENSES && styles.statNameBold]}
                underlineGap={2}
                onPress={() => setChartView(CHART_VIEW.EXPENSES)}
              >
                Expenses
              </TitleLink>

              <Text style={styles.statValue}>{formatAmount(-totalExpenses)}</Text>
            </View>
          )}

          {totalSavingsAndInvestments && (
            <View style={styles.statRow}>
              <TitleLink
                textStyle={[styles.statName, chartView === CHART_VIEW.SAVINGS && styles.statNameBold]}
                underlineGap={2}
                onPress={() => setChartView(CHART_VIEW.SAVINGS)}
              >
                Savings
              </TitleLink>

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

  content: {
    justifyContent: 'space-between',
  },

  chart: {
    marginTop: 40,
    marginLeft: -58,
  },

  stats: {
    paddingTop: 48,
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
