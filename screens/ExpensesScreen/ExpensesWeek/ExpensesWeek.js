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
  onScrollTo: PropTypes.func,
  expenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
};

export default function ExpensesWeek (props) {
  const {
    style,
    year,
    monthNumber,
    weekNumber,
    onScrollTo,
    expenses = {},
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const [selectedDayIndex, setSelectedDayIndex] = useState();

  const [categoryId, setCategoryId] = useState(SHOW_ALL_CATEGORY_ID);

  const daysInMonth = getDaysInMonth(year, monthNumber);
  const daysInWeek = getDaysInWeek(weekNumber, daysInMonth);

  const currentWeekExpenses = filterWeekExpensesByCategory(expenses?.[weekNumber] || [], categoryId);
  const expensesGroupedByDays = groupWeekByDay(currentWeekExpenses, daysInWeek);
  const expensesByDays = getWeekChartPointsByDay(expensesGroupedByDays);

  const totalExpenses = expensesByDays.reduce((total, weekTotal) => total + weekTotal, 0);

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
    : 44; // desktop

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
          style={styles.categoryDropdown}
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
          year={Number(year)}
          monthNumber={monthNumber}
          daysInWeek={daysInWeek}
          expensesByDays={expensesByDays}
          selectedDayIndex={selectedDayIndex}
          onDaySelected={setSelectedDayIndex}
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

  content: {
    justifyContent: 'space-between',
  },
});
