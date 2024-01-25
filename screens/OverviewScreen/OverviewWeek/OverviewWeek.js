import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WeekChart, { CHART_VIEW } from './WeekChart';
import WeekStats from './WeekStats';
import TitleLink from '../../../components/TitleLink';
import { MONTH_NAME, getDaysInMonth, getDaysInWeek } from '../../../services/date';
import { FONT } from '../../../styles/fonts';
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

  const daysInMonthNumber = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonthNumber);

  const totalIncomes = getTotalAmount(currentWeekIncomes);
  const previousWeeksTotalIncomes = getPreviousWeeksTotalAmount(incomes);

  const totalExpenses = getTotalAmount(currentWeekExpenses);
  const previousWeeksTotalExpenses = getPreviousWeeksTotalAmount(expenses);

  const totalSavingsAndInvestments = (getTotalAmount(currentWeekSavings) + getTotalAmount(currentWeekInvestments)) || 0;
  const previousWeeksTotalSavings = getPreviousWeeksTotalAmount(savings);
  const previousWeeksTotalInvestments = getPreviousWeeksTotalAmount(investments);

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
    ? windowWidth < MEDIA.WIDE_MOBILE
      ? daysInWeek > 7 ? '108%' : '110%'
      : daysInWeek > 7 ? '109%' : '112%'
    : windowWidth < MEDIA.DESKTOP
      ? windowWidth < MEDIA.WIDE_TABLET
        ? daysInWeek > 7 ? '109%' : '112%'
        : daysInWeek > 7 ? '109%' : '113%'
      : columnWidth;
  const chartMarginLeft = windowWidth < MEDIA.TABLET
    ? windowWidth < MEDIA.WIDE_MOBILE
      ? windowWidth < MEDIA.MOBILE
        ? daysInWeek > 7 ? -29 : -18 // mobile
        : daysInWeek > 7 ? -23 : -8 // wide-mobile
      : daysInWeek > 7 ? -8 : 12
    : windowWidth < MEDIA.DESKTOP
      ? windowWidth < MEDIA.WIDE_TABLET
        ? daysInWeek > 7 ? 1 : 37 // wide-tablet
        : daysInWeek > 7 ? 23 : 55 // tablet
      : -58; // desktop
  const chartMarginTop = windowWidth < MEDIA.TABLET
    ? 16
    : windowWidth < MEDIA.DESKTOP ? 24 : 40;

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

  return (
    <View style={[styles.overviewWeek, style]}>
      <View style={styles.titleContainer}>
        <TitleLink
          style={[styles.subtitleLink, { paddingLeft: subtitlePaddingLeft }]}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
        >
          {WEEK_NAME[weekNumber]}
        </TitleLink>

        <Text style={[styles.weekRangeText, {
          marginLeft: windowWidth < MEDIA.WIDE_MOBILE ? 16 : 32,
          paddingBottom: windowWidth >= MEDIA.DESKTOP ? 10 : 8,
          fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
          lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
        }]}>
          {MONTH_NAME[monthNumber].substring(0, 3)} {(getWeekRange(weekNumber, getDaysInMonth(year, monthNumber)))}
        </Text>
      </View>

      <View style={[styles.content, {
        flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
        alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
      }]}>
        <WeekChart
          style={[styles.chart, {
            width: chartWidth,
            marginLeft: chartMarginLeft,
            marginTop: chartMarginTop,
          }]}
          year={year}
          chartView={chartView}
          daysInWeek={daysInWeek}
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

        <WeekStats
          style={[styles.stats, {
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingTop: windowWidth < MEDIA.DESKTOP ? 0 : 44,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 32 : 40,
            paddingRight: windowWidth < MEDIA.DESKTOP ? 32 : 0,
          }]}
          chartView={chartView}
          setChartView={setChartView}
          totalIncomes={totalIncomes}
          previousWeeksTotalIncomes={previousWeeksTotalIncomes}
          totalExpenses={totalExpenses}
          previousWeeksTotalExpenses={previousWeeksTotalExpenses}
          totalSavingsAndInvestments={totalSavingsAndInvestments}
          previousWeeksTotalSavings={previousWeeksTotalSavings}
          previousWeeksTotalInvestments={previousWeeksTotalInvestments}
        />
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
  },

  content: {
    justifyContent: 'space-between',
  },

  chart: {},
});
