import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import YearChart, { CHART_VIEW } from './YearChart';
import TitleLink from '../../../components/TitleLink';
import { formatAmount, getAmountColor } from '../../../services/amount';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';
import { MEDIA } from '../../../styles/media';

OverviewYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

export default function OverviewYear (props) {
  const {
    style,
    year,
    expenses = {},
    incomes = {},
    savings = {},
    investments = {},
  } = props;

  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [chartView, setChartView] = useState(CHART_VIEW.INCOME);

  function getTotalAmount (yearItems) {
    return Object.keys(yearItems)
      .map(monthNumber => ([
        ...(yearItems[monthNumber]?.[1] || []),
        ...(yearItems[monthNumber]?.[2] || []),
        ...(yearItems[monthNumber]?.[3] || []),
        ...(yearItems[monthNumber]?.[4] || []),
      ]))
      .map(flatMonthData => {
        return flatMonthData.reduce((total, item) => {
          const amount = item.amount || (item.shares * item.pricePerShare);
          return total + amount;
        }, 0);
      })
      .reduce((monthTotal, yearTotal) => monthTotal + yearTotal, 0);
  }

  const totalIncomes = getTotalAmount(incomes);
  const totalExpenses = getTotalAmount(expenses);
  const totalSavingsAndInvestments = (getTotalAmount(savings) + getTotalAmount(investments)) || 0;
  const savingsPercent = Math.floor(totalSavingsAndInvestments * 100 / totalIncomes);

  const totalExcludingSavings = totalIncomes - totalExpenses;
  const total = totalExcludingSavings - totalSavingsAndInvestments;

  const totalExcludingSavingsColor = getAmountColor(totalExcludingSavings);
  const totalColor = getAmountColor(total);

  useEffect(() => {
    if (chartView === CHART_VIEW.INCOME && !totalIncomes) {
      if (totalExpenses) {
        setChartView(CHART_VIEW.EXPENSES);
      } else if (totalSavingsAndInvestments) {
        setChartView(CHART_VIEW.SAVINGS);
      }
    } else if (chartView === CHART_VIEW.EXPENSES && !totalExpenses) {
      if (totalIncomes) {
        setChartView(CHART_VIEW.INCOME);
      } else if (totalSavingsAndInvestments) {
        setChartView(CHART_VIEW.SAVINGS);
      }
    } else if (chartView === CHART_VIEW.SAVINGS && !totalSavingsAndInvestments) {
      if (totalIncomes) {
        setChartView(CHART_VIEW.INCOME);
      } else if (totalExpenses) {
        setChartView(CHART_VIEW.EXPENSES);
      }
    }
  }, [totalIncomes, totalExpenses, totalSavingsAndInvestments]);

  const columnWidth = windowWidth < MEDIA.DESKTOP
    ? '100%'
    : '50%';
  const chartWidth = windowWidth < MEDIA.TABLET
    ? windowWidth < MEDIA.MOBILE
      ? '106%' // mobile
      : '106%' // wide-mobile
    : windowWidth < MEDIA.DESKTOP
      ? '107%' // tablet
      : columnWidth; // desktop
  const chartMarginLeft = windowWidth < MEDIA.TABLET
    ? windowWidth < MEDIA.MOBILE
      ? -35 // mobile
      : -27 // wide-mobile
    : windowWidth < MEDIA.DESKTOP
      ? 0 // tablet
      : -58; // desktop

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
          : -8 // wide-mobile
        : -24 // wide-mobile
      : -54 // tablet
    : 0; // desktop

  const isEmptyYear = !totalIncomes && !totalExpenses && !totalSavingsAndInvestments;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.overviewYear, style]}>
      <View style={styles.titleContainer}>
        <TitleLink
          style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          onPress={() => navigation.navigate('OverviewMonths')}
        >
          {year}
        </TitleLink>
      </View>

      <View style={[styles.content, {
        flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
        alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
      }]}>
        <YearChart
          style={[styles.chart, {
            width: chartWidth,
            marginLeft: chartMarginLeft,
          }]}
          year={year}
          chartView={chartView}
          setChartView={setChartView}
          incomes={incomes}
          expenses={expenses}
          savings={savings}
          investments={investments}
        />

        <View style={[styles.stats, {
          width: columnWidth,
          marginTop: statsMarginTop,
          paddingTop: windowWidth < MEDIA.DESKTOP ? 0 : 24,
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
            <View style={[styles.statRow, !totalIncomes && { marginTop: 0 }]}>
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
            <View style={[styles.statRow, (!totalIncomes && !totalExpenses) && { marginTop: 0 }]}>
              <TitleLink
                textStyle={[
                  styles.statName,
                  chartView === CHART_VIEW.SAVINGS && styles.statNameBold,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                ]}
                onPress={() => setChartView(CHART_VIEW.SAVINGS)}
              >
                Savings / Investments
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
  overviewYear: {
    flexGrow: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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

  chart: {
    marginTop: 16,
  },

  stats: {},
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
