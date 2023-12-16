import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WeekChart, { CHART_VIEW } from './WeekChart';
import TitleLink from '../../../components/TitleLink';
import { MONTH_NAME, getDaysInMonth } from '../../../services/date';
import { FONT } from '../../../styles/fonts';
import { COLOR } from '../../../styles/colors';
import { MEDIA } from '../../../styles/media';

OverviewWeek.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  incomes: PropTypes.object, // weeks -> incomes { [1]: [], [2]: [] }
  savings: PropTypes.object, // weeks -> savings { [1]: [], [2]: [] }
  investments: PropTypes.object, // weeks -> investments { [1]: [], [2]: [] }
};

const WEEK_NAME = {
  [1]: 'Week 1',
  [2]: 'Week 2',
  [3]: 'Week 3',
  [4]: 'Week 4',
};

function getWeekRange (weekNumber, daysInMonth) {
  const range = {
    [1]: '1 - 7',
    [2]: '8 - 14',
    [3]: '15 - 21',
    [4]: `22 - ${daysInMonth}`,
  };

  return range[weekNumber];
}

export default function OverviewWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    expenses = {},
    incomes = {},
    savings = {},
    investments = {},
  } = props;

  const currentWeekIncomes = incomes?.[weekNumber] || [];
  const currentWeekExpenses = expenses?.[weekNumber] || [];
  const currentWeekSavings = savings?.[weekNumber] || [];
  const currentWeekInvestments = investments?.[weekNumber] || [];

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [chartView, setChartView] = useState(CHART_VIEW.INCOME);

  function formatAmount (number) {
    return `${Math.sign(number) === -1 ? '- ' : '+'}${parseFloat(Math.abs(number).toFixed(2)).toLocaleString()}`;
  }

  function getTotalAmount (items) {
    return items.reduce((total, item) => {
      const amount = item.amount || (item.shares * item.pricePerShare);
      return total + amount;
    }, 0);
  }

  function getPreviousWeeksTotalAmount (items) {
    const weekKeys = Object
      .keys(items)
      .filter(weekKey => weekKey < weekNumber) || [];

    return weekKeys.reduce((total, weekKey) => total + getTotalAmount(items[weekKey] || []), 0);
  }

  function getAmountColor (amount) {
    const isPositive = amount >= 0;

    return isPositive ? COLOR.GREEN : COLOR.RED;
  }

  const totalIncomes = getTotalAmount(currentWeekIncomes);
  const previousWeeksTotalIncomes = getPreviousWeeksTotalAmount(incomes);

  const totalExpenses = getTotalAmount(currentWeekExpenses);
  const previousWeeksTotalExpenses = getPreviousWeeksTotalAmount(expenses);

  const totalSavingsAndInvestments = (getTotalAmount(currentWeekSavings) + getTotalAmount(currentWeekInvestments)) || 0;
  const previousWeeksTotalSavings = getPreviousWeeksTotalAmount(savings);
  const previousWeeksTotalInvestments = getPreviousWeeksTotalAmount(investments);

  const totalExcludingSavings = (totalIncomes + previousWeeksTotalIncomes) - (totalExpenses + previousWeeksTotalExpenses);
  const total = totalExcludingSavings - totalSavingsAndInvestments - previousWeeksTotalSavings - previousWeeksTotalInvestments;

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
    ? '102%'
    : windowWidth < MEDIA.DESKTOP
      ? '103%'
      : columnWidth;
  const chartMarginLeft = windowWidth < MEDIA.TABLET
    ? -50
    : windowWidth < MEDIA.DESKTOP
      ? -40
      : -58;

  const subtitleFontSize = windowWidth < MEDIA.DESKTOP
    ?  windowWidth < MEDIA.TABLET ? 33 : 36
    : 40;
  const subtitlePaddingLeft = windowWidth < MEDIA.DESKTOP ? 28 : 0;
  const statsMarginTop = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET ? 0 : -40
    : 0;

  return (
    <View style={[styles.overviewWeek, style]}>
      <View style={styles.titleContainer}>
        <TitleLink
          style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
          textStyle={[styles.subtitleLinkText, { fontSize: subtitleFontSize }]}
        >
          {WEEK_NAME[weekNumber]}
        </TitleLink>

        <Text style={styles.weekRangeText}>
          {MONTH_NAME[monthNumber].substring(0, 3)} {(getWeekRange(weekNumber, getDaysInMonth(year, monthNumber)))}
        </Text>
      </View>

      <View style={[
        styles.content,
        {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        },
      ]}>
        <WeekChart
          style={[styles.chart, {
            width: chartWidth,
            marginLeft: chartMarginLeft,
          }]}
          year={year}
          chartView={chartView}
          setChartView={setChartView}
          monthNumber={monthNumber}
          weekNumber={weekNumber}
          incomes={currentWeekIncomes}
          previousWeeksTotalIncomes={previousWeeksTotalIncomes}
          expenses={currentWeekExpenses}
          previousWeeksTotalExpenses={previousWeeksTotalExpenses}
          savings={currentWeekSavings}
          previousWeeksTotalSavings={previousWeeksTotalSavings}
          investments={currentWeekInvestments}
          previousWeeksTotalInvestments={previousWeeksTotalInvestments}
        />

        <View style={[
          styles.stats,
          {
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingTop: windowWidth < MEDIA.DESKTOP ? 0 : 48,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 32 : 40,
            paddingRight: windowWidth < MEDIA.DESKTOP ? 32 : 0,
          },
        ]}>
          {!!totalIncomes && (
            <View style={[styles.statRow, { marginTop: 0 }]}>
              <TitleLink
                textStyle={[
                  styles.statName,
                  chartView === CHART_VIEW.INCOME && styles.statNameBold,
                  windowWidth < MEDIA.DESKTOP && styles.statNameSmaller,
                ]}
                underlineGap={2}
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
                underlineGap={2}
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
                underlineGap={2}
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

          <View style={styles.underline} />

          {!!(totalSavingsAndInvestments || previousWeeksTotalSavings || previousWeeksTotalInvestments) && (
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
  overviewWeek: {
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

  weekRangeText: {
    fontFamily: FONT.NOTO_SERIF.REGULAR,
    fontSize: 21,
    lineHeight: 21,
    marginLeft: 32,
    paddingBottom: 12,
  },

  content: {
    justifyContent: 'space-between',
  },

  chart: {
    marginTop: 40,
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
