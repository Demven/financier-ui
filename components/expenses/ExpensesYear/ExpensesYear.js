import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import YearChart from './YearChart';
import YearStats from './YearStats';
import TitleLink from '../../TitleLink';
import { TAB } from '../../HeaderTabs';
import CategoryDropdown, { SHOW_ALL_CATEGORY_ID } from '../../CategoryDropdown';
import Loader from '../../Loader';
import { MONTHS_IN_YEAR } from '../../../services/date';
import { getTotalAmountsByMonths } from '../../../services/amount';
import { filterYearExpensesByCategory } from '../../../services/dataItems';
import { fetchExpensesForYear } from '../../../services/api/expense';
import { addExpensesGroupedByYearMonthWeekAction } from '../../../redux/reducers/expenses';
import { FONT } from '../../../styles/fonts';
import { MEDIA } from '../../../styles/media';

ExpensesYear.propTypes = {
  style: PropTypes.any,
  year: PropTypes.number.isRequired,
  yearExpenses: PropTypes.object, // weeks -> expenses { [1]: [], [2]: [] }
  yearTotalExpenses: PropTypes.object, // weeks -> expensesTotals { total: ?, [1]: ?, [2]: ? }
  yearIncome: PropTypes.number.isRequired,
  previousYear: PropTypes.number.isRequired,
  previousYearTotalExpenses: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default function ExpensesYear (props) {
  const {
    style,
    year,
    yearExpenses = {},
    yearTotalExpenses = {},
    yearIncome,
    previousYear,
    previousYearTotalExpenses,
    visible = false,
  } = props;

  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState();

  const [categoryId, setCategoryId] = useState(SHOW_ALL_CATEGORY_ID);

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const allTimeYearAverage = useSelector(state => state.expenses.expensesTotals.yearAverage);

  useEffect(() => {
    if (visible && !initialized) {
      setInitialized(true);
    }
  }, [visible]);

  useEffect(() => {
    const yearHasData = !!Object.keys(yearExpenses).length;

    if (visible && !yearHasData && !loading) {
      loadYearExpenses();
    } else if (loading && yearHasData) {
      setLoading(false);
    }
  }, [visible, yearExpenses, loading]);

  async function loadYearExpenses () {
    setLoading(true);

    const expenses = await fetchExpensesForYear(year);

    if (expenses) {
      dispatch(addExpensesGroupedByYearMonthWeekAction(expenses));
    }

    setLoading(false);
  }

  function groupByMonth (yearItems) {
    const groupedByMonth = new Array(MONTHS_IN_YEAR).fill([]);

    Object.keys(yearItems).forEach(monthNumber => {
      groupedByMonth[monthNumber - 1] = [
        ...(yearItems[monthNumber][1] || []),
        ...(yearItems[monthNumber][2] || []),
        ...(yearItems[monthNumber][3] || []),
        ...(yearItems[monthNumber][4] || []),
      ];
    });

    return groupedByMonth;
  }

  const filteredExpenses = filterYearExpensesByCategory(yearExpenses, categoryId);
  const expensesGroupedByMonth = groupByMonth(filteredExpenses);
  const totalAmountsByMonths = getTotalAmountsByMonths(expensesGroupedByMonth);

  const totalExpenses = categoryId === SHOW_ALL_CATEGORY_ID
    ? yearTotalExpenses?.total || 0
    : totalAmountsByMonths.reduce((total, month) => total + month, 0);

  const categoryIds = Array.from(new Set(expensesGroupedByMonth.flatMap(monthExpenses => monthExpenses.map(expense => expense.categoryId))));

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

  const isEmptyYear = !totalExpenses;

  if (isEmptyYear) {
    return null;
  }

  return (
    <View style={[styles.expensesYear, style]}>
      <View style={[styles.titleContainer, { width: columnWidth }]}>
        <TitleLink
          style={styles.subtitleLink}
          textStyle={[styles.subtitleLinkText, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
          }]}
          alwaysHighlighted
          navigateTo={{
            pathname: `/expenses/${TAB.MONTHS}`,
            params: { year },
          }}
        >
          {year}
        </TitleLink>

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
          categoryId={categoryId}
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
        <YearChart
          style={{ width: chartWidth }}
          expensesByMonths={totalAmountsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          onMonthSelected={setSelectedMonthIndex}
          totalExpenses={totalExpenses}
          yearIncome={yearIncome}
          previousYearTotalExpenses={previousYearTotalExpenses}
          previousYear={previousYear}
          allTimeYearAverage={allTimeYearAverage}
          showSecondaryComparisons={categoryId === SHOW_ALL_CATEGORY_ID}
        />

        <YearStats
          style={{
            width: columnWidth,
            marginTop: statsMarginTop,
            paddingLeft: windowWidth < MEDIA.DESKTOP ? 0 : 40,
          }}
          year={year}
          expensesByMonths={totalAmountsByMonths}
          selectedMonthIndex={selectedMonthIndex}
          totalExpenses={totalExpenses}
          yearIncome={yearIncome}
          previousYearTotalExpenses={previousYearTotalExpenses}
          previousYear={previousYear}
          allTimeYearAverage={allTimeYearAverage}
          showSecondaryComparisons={categoryId === SHOW_ALL_CATEGORY_ID}
        />
      </View>

      <Loader
        overlayStyle={styles.loaderOverlay}
        loading={!initialized || loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  expensesYear: {
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
    right: 0,
    left: 'auto',
    top: 6,
  },

  content: {
    justifyContent: 'space-between',
  },

  loaderOverlay: {
    marginTop: -12,
  },
});
