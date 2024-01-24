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
import { MONTH_NAME } from '../../../services/date';
import { formatAmount, getAmountColor } from '../../../services/amount';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';
import { MEDIA } from '../../../styles/media';

SavingsMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

export default function SavingsMonth (props) {
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

  const totalIncomes = getTotalAmount(incomes);
  const totalExpenses = getTotalAmount(expenses);
  const totalSavingsAndInvestments = (getTotalAmount(savings) + getTotalAmount(investments)) || 0;
  const savingsPercent = Math.floor(totalSavingsAndInvestments * 100 / totalIncomes);

  const totalExcludingSavings = totalIncomes - totalExpenses;
  const total = totalExcludingSavings - totalSavingsAndInvestments;

  const totalExcludingSavingsColor = getAmountColor(totalExcludingSavings);
  const totalColor = getAmountColor(total);

  const columnWidth = windowWidth < MEDIA.DESKTOP
    ? '100%'
    : '50%';
  const chartWidth = windowWidth < MEDIA.TABLET
    ? '102%'
    : windowWidth < MEDIA.DESKTOP
      ? '103%'
      : columnWidth;
  const chartMarginLeft = windowWidth < MEDIA.TABLET
    ? -50
    : (windowWidth < MEDIA.DESKTOP ? -40 : -58);
  const chartMarginTop = windowWidth < MEDIA.TABLET
    ? 16
    : (windowWidth < MEDIA.DESKTOP ? 24 : 40);

  const subtitleFontSize = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 28 // mobile
      : 36 // tablet
    : 40; // desktop
  const subtitleLineHeight = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 32 // mobile
      : 40 // tablet
    : 44; // desktop
  const subtitlePaddingLeft = windowWidth < MEDIA.DESKTOP ? 28 : 0;

  const statsMarginTop = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? windowWidth < MEDIA.WIDE_MOBILE
        ? windowWidth < MEDIA.MOBILE
          ? 0 // mobile
          : 8 // wide-mobile
        : -16 // wide-mobile
      : -54 // tablet
    : 0; // desktop

  return (
    <View style={[styles.savingsMonth, style]}>
      <TitleLink
        style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
        textStyle={[styles.subtitleLinkText, {
          fontSize: subtitleFontSize,
          lineHeight: subtitleLineHeight,
        }]}
        alwaysHighlighted
        onPress={() => navigation.navigate('OverviewWeeks', { monthNumber })}
      >
        {MONTH_NAME[monthNumber]}
      </TitleLink>

      <View style={[styles.content, {
        flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
        alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
      }]}>
        <MonthChart
          style={[styles.chart, {
            width: chartWidth,
            marginLeft: chartMarginLeft,
            marginTop: chartMarginTop,
          }]}
          year={Number(year)}
          chartView={chartView}
          setChartView={setChartView}
          monthNumber={monthNumber}
          expenses={expenses}
          incomes={incomes}
          savings={savings}
          investments={investments}
        />

        <View style={[styles.stats, {
          width: columnWidth,
          marginTop: statsMarginTop,
          paddingTop: windowWidth < MEDIA.DESKTOP ? 0 : 48,
          paddingLeft: windowWidth < MEDIA.DESKTOP ? 32 : 40,
          paddingRight: windowWidth < MEDIA.DESKTOP ? 32 : 0,
        }]}>
          {!!totalIncomes && (
            <View style={[styles.statRow, { marginTop: 0 }]}>
              <TitleLink
                textStyle={[
                  styles.statName,
                  chartView === CHART_VIEW.INCOME && styles.statNameBold,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                ]}
                onPress={() => setChartView(CHART_VIEW.INCOME)}
              >
                Income
              </TitleLink>

              <Text style={[
                styles.statValue,
                chartView === CHART_VIEW.INCOME && styles.statValueBold,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
              ]}>
                {formatAmount(totalIncomes)}
              </Text>
            </View>
          )}

          {!!totalExpenses && (
            <View style={styles.statRow}>
              <TitleLink
                textStyle={[
                  styles.statName,
                  chartView === CHART_VIEW.EXPENSES && styles.statNameBold,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                ]}
                onPress={() => setChartView(CHART_VIEW.EXPENSES)}
              >
                Expenses
              </TitleLink>

              <Text style={[
                styles.statValue,
                chartView === CHART_VIEW.EXPENSES && styles.statValueBold,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
              ]}>
                {formatAmount(-totalExpenses)}
              </Text>
            </View>
          )}

          {!!totalSavingsAndInvestments && (
            <View style={styles.statRow}>
              <TitleLink
                textStyle={[
                  styles.statName,
                  chartView === CHART_VIEW.SAVINGS && styles.statNameBold,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                ]}
                onPress={() => setChartView(CHART_VIEW.SAVINGS)}
              >
                Savings
              </TitleLink>

              <Text style={[
                styles.statValue,
                chartView === CHART_VIEW.SAVINGS && styles.statValueBold,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
              ]}>
                {formatAmount(totalSavingsAndInvestments)}
              </Text>
            </View>
          )}

          {!!savingsPercent && (
            <View style={[styles.statRow, { marginTop: 12 }]}>
              <Text style={[styles.statValue, styles.smallerText]}>({savingsPercent}%)</Text>
            </View>
          )}

          <View style={styles.underline} />

          {!!totalSavingsAndInvestments && (
            <View style={styles.statRow}>
              <Text style={[styles.statName, styles.smallerText]}>(Excluding Savings)</Text>

              <Text style={[
                styles.statValue,
                styles.statValueBold,
                windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
                { color: totalExcludingSavingsColor },
              ]}>
                {formatAmount(totalExcludingSavings)}
              </Text>
            </View>
          )}

          <View style={styles.statRow}>
            <Text style={[
              styles.statName,
              styles.statNameBold,
              windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
              { color: totalColor },
            ]}>
              Total
            </Text>

            <Text style={[
              styles.statValue,
              styles.statValueBold,
              windowWidth < MEDIA.DESKTOP && styles.statValueSmaller,
              { color: totalColor },
            ]}>
              {formatAmount(total)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  savingsMonth: {
    flexGrow: 1,
  },

  subtitleLink: {
    alignSelf: 'flex-start',
  },
  subtitleLinkText: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },

  content: {
    justifyContent: 'space-between',
  },

  chart: {},

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
  statNameSmaller: {
    fontSize: 21,
    lineHeight: 26,
  },

  statValue: {
    marginLeft: 'auto',
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 24,
    lineHeight: 30,
    color: COLOR.DARK_GRAY,
    userSelect: 'text',
  },
  statValueBold: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
  },
  statValueSmaller: {
    fontSize: 21,
    lineHeight: 26,
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
