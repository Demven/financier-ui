import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MonthChart from './MonthChart';
import MonthStats from './MonthStats';
import TitleLink from '../../TitleLink';
import { TAB } from '../../HeaderTabs';
import CategoryDropdown, { SHOW_ALL_CATEGORY_ID } from '../../CategoryDropdown';
import { MONTH_NAME } from '../../../services/date';
import {
  getMonthChartPointsByWeek,
  filterMonthExpensesByCategory,
} from '../../../services/dataItems';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

ExpensesMonth.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  monthNumber: PropTypes.number.isRequired,
  monthIncome: PropTypes.number,
  monthExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  monthExpensesTotal: PropTypes.number,
  previousMonthTotalExpenses: PropTypes.number,
  previousMonthName: PropTypes.string,
  onScrollTo: PropTypes.func,
};

export default function ExpensesMonth (props) {
  const {
    style,
    year,
    monthNumber,
    monthIncome = 0,
    monthExpenses = {},
    monthExpensesTotal = 0,
    previousMonthTotalExpenses = 0,
    previousMonthName = '',
    onScrollTo,
  } = props;

  const [selectedWeekIndex, setSelectedWeekIndex] = useState();

  const [categoryId, setCategoryId] = useState(SHOW_ALL_CATEGORY_ID);

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const filteredExpenses = filterMonthExpensesByCategory(monthExpenses, categoryId);
  const expensesByWeeks = getMonthChartPointsByWeek(filteredExpenses);

  const totalExpenses = categoryId === SHOW_ALL_CATEGORY_ID
    ? monthExpensesTotal
    : expensesByWeeks.reduce((total, weekTotal) => total + weekTotal, 0);

  const categoryIds = Array.from(
    new Set([
      ...(monthExpenses?.[1] || []),
      ...(monthExpenses?.[2] || []),
      ...(monthExpenses?.[3] || []),
      ...(monthExpenses?.[4] || []),
    ].map(expense => expense.categoryId))
  );

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

  const isEmptyMonth = !totalExpenses;

  if (isEmptyMonth) {
    return null;
  }

  return (
    <View
      style={[styles.expensesMonth, style]}
      onLayout={onLayout}
    >
      <View style={[styles.titleContainer, { width: columnWidth }]}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          navigateTo={{
            pathname: `/expenses/${TAB.WEEKS}`,
            params: { monthNumber },
          }}
        >
          {MONTH_NAME[monthNumber]}
        </TitleLink>

        <CategoryDropdown
          style={[
            styles.categoryDropdown,
            windowWidth < MEDIA.WIDE_MOBILE && styles.categoryDropdownMobile,
            windowWidth >= MEDIA.WIDE_MOBILE && windowWidth < MEDIA.TABLET && styles.categoryDropdownTablet,
          ]}
          categoryId={categoryId}
          placeholderStyle={{
            fontSize: windowWidth < MEDIA.WIDE_MOBILE ? 18 : 20,
            lineHeight: windowWidth < MEDIA.WIDE_MOBILE ? 22 : 24,
          }}
          includeCategoryIds={categoryIds}
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
        <MonthChart
          style={{ width: chartWidth }}
          year={Number(year)}
          monthNumber={monthNumber}
          expensesByWeeks={expensesByWeeks}
          selectedWeekIndex={selectedWeekIndex}
          onWeekSelected={setSelectedWeekIndex}
        />

        <MonthStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          monthNumber={monthNumber}
          monthIncome={monthIncome}
          expensesByWeeks={expensesByWeeks}
          totalExpenses={totalExpenses}
          previousMonthTotalExpenses={previousMonthTotalExpenses}
          previousMonthName={previousMonthName}
          selectedWeekIndex={selectedWeekIndex}
          showSecondaryComparisons={categoryId === SHOW_ALL_CATEGORY_ID}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expensesMonth: {
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
