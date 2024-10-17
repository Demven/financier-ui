import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import WeekChart from './WeekChart';
import WeekStats from './WeekStats';
import TitleLink from '../../../components/TitleLink';
import CategoryDropdown, { SHOW_ALL_CATEGORY_ID } from '../../../components/CategoryDropdown';
import {
  getDaysInMonth,
  getWeekRange,
  getDaysInWeek,
  MONTH_NAME,
} from '../../../services/date';
import {
  filterWeekExpensesByCategory,
  getWeekChartPointsByDay,
  groupWeekByDay,
} from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

ExpensesWeek.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  weekNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number.isRequired,
  weekExpenses: PropTypes.arrayOf(PropTypes.object), // []
  weekExpensesTotal: PropTypes.number.isRequired,
  previousWeekTotalExpenses: PropTypes.number.isRequired,
  previousMonthName: PropTypes.string,
  onScrollTo: PropTypes.func,
};

export default function ExpensesWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    monthIncome,
    weekExpenses = [],
    weekExpensesTotal = 0,
    previousWeekTotalExpenses = 0,
    previousMonthName = '',
    onScrollTo,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeWeekAverage = useSelector(state => state.expenses.expensesTotals.weekAverage);

  const [selectedDayIndex, setSelectedDayIndex] = useState();

  const [categoryId, setCategoryId] = useState(SHOW_ALL_CATEGORY_ID);

  const daysInMonth = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonth);

  const currentWeekExpenses = filterWeekExpensesByCategory(weekExpenses, categoryId);
  const expensesGroupedByDays = groupWeekByDay(currentWeekExpenses, daysInWeek);
  const expensesByDays = getWeekChartPointsByDay(expensesGroupedByDays);

  const totalExpenses = categoryId === SHOW_ALL_CATEGORY_ID
    ? weekExpensesTotal
    : expensesByDays.reduce((total, weekTotal) => total + weekTotal, 0);

  const categoryIds = Array.from(new Set(currentWeekExpenses.map(expense => expense.categoryId)));

  function onLayout (event) {
    if (typeof onScrollTo === 'function') {
      onScrollTo(event.nativeEvent.layout.y);
    }
  }

  const columnWidth = windowWidth < MEDIA.DESKTOP
    ? '100%'
    : '50%';
  const chartWidth = windowWidth < MEDIA.DESKTOP
    ? '100%' // mobile/tablet
    : columnWidth; // desktop

  const subtitleFontSize = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 28 // mobile
      : 36 // tablet
    : 40; // desktop
  const subtitleLineHeight = windowWidth < MEDIA.DESKTOP
    ? windowWidth < MEDIA.TABLET
      ? 32 // mobile
      : 40 // tablet
    : 50; // desktop

  const statsMarginTop = windowWidth < MEDIA.MEDIUM_DESKTOP
    ? windowWidth < MEDIA.DESKTOP
      ? 40 // tablet/mobile
      : -24 // desktop
    : -20; // large desktop

  const isEmptyWeek = !totalExpenses;

  if (isEmptyWeek) {
    return null;
  }

  return (
    <View
      style={[styles.expensesWeek, style]}
      onLayout={onLayout}
    >
      <View style={[styles.titleContainer, { width: columnWidth }]}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
        >
          Week {weekNumber}
        </TitleLink>

        <Text style={[styles.weekRangeText, {
          marginLeft: windowWidth < MEDIA.WIDE_MOBILE ? 16 : 32,
          paddingBottom: windowWidth >= MEDIA.DESKTOP ? 10 : 8,
          fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
          lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 21,
        }]}>
          {MONTH_NAME[monthNumber].substring(0, 3)} {(getWeekRange(weekNumber, getDaysInMonth(year, monthNumber)))}
        </Text>

        <CategoryDropdown
          style={[
            styles.categoryDropdown,
            windowWidth < MEDIA.WIDE_MOBILE && styles.categoryDropdownMobile,
            windowWidth >= MEDIA.WIDE_MOBILE && windowWidth < MEDIA.TABLET && styles.categoryDropdownTablet,
          ]}
          placeholderStyle={{
            fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 20,
            lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 22 : 24,
          }}
          includeCategoryIds={categoryIds}
          categoryId={categoryId}
          showAll
          onSelect={setCategoryId}
        />
      </View>

      <View
        style={[styles.content, {
          flexDirection: windowWidth < MEDIA.DESKTOP ? 'column' : 'row',
          alignItems: windowWidth < MEDIA.DESKTOP ? 'center' : 'flex-start',
        }]}
      >
        <WeekChart
          style={{ width: chartWidth }}
          daysInWeek={daysInWeek}
          expensesByDays={expensesByDays}
          selectedDayIndex={selectedDayIndex}
          onDaySelected={setSelectedDayIndex}
          totalExpenses={totalExpenses}
          monthIncome={monthIncome}
          previousWeekTotalExpenses={previousWeekTotalExpenses}
          previousMonthName={previousMonthName}
          allTimeWeekAverage={allTimeWeekAverage}
          showSecondaryComparisons={categoryId === SHOW_ALL_CATEGORY_ID}
        />

        <WeekStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          monthNumber={monthNumber}
          weekExpenses={currentWeekExpenses}
          totalExpenses={totalExpenses}
          monthIncome={monthIncome}
          previousWeekTotalExpenses={previousWeekTotalExpenses}
          previousMonthName={previousMonthName}
          allTimeWeekAverage={allTimeWeekAverage}
          showSecondaryComparisons={categoryId === SHOW_ALL_CATEGORY_ID}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expensesWeek: {
    flexGrow: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    zIndex: 1,
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

  categoryDropdown: {
    width: 300,
    position: 'absolute',
    right: 0,
    top: -14,
  },
  categoryDropdownMobile: {
    width: '100%',
    left: 0,
    top: 54,
  },
  categoryDropdownTablet: {
    width: '50%',
    left: 0,
    top: 54,
  },

  content: {
    justifyContent: 'space-between',
  },
});
