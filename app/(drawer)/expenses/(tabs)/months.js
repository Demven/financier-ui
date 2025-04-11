import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  useNavigation,
  useGlobalSearchParams,
  usePathname,
} from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { ViewPortDetector, ViewPortDetectorProvider } from 'react-native-viewport-detector';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { setSelectedTabAction, setSelectedYearAction } from '../../../../redux/reducers/ui';
import ExpensesMonth from '../../../../components/expenses/ExpensesMonth/ExpensesMonth';
import ExpensesWeek from '../../../../components/expenses/ExpensesWeek/ExpensesWeek';
import ExpensesYear from '../../../../components/expenses/ExpensesYear/ExpensesYear';
import NoDataPlaceholder from '../../../../components/NoDataPlaceholder';
import HeaderDropdown from '../../../../components/HeaderDropdown';
import { TAB } from '../../../../components/HeaderTabs';
import Loader from '../../../../components/Loader';
import { getLastMonthNumberInYear, MONTH_NAME } from '../../../../services/date';
import { getTimespan } from '../../../../services/location';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

export default function ExpensesScreen () {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const selectedMonth = useSelector(state => state.ui.selectedMonth);
  const selectedWeek = useSelector(state => state.ui.selectedWeek);
  const loading = useSelector(state => state.ui.loading);

  const expenses = useSelector(state => state.expenses.expenses) || {};
  const expensesTotals = useSelector(state => state.expenses.expensesTotals) || {};
  const incomesTotals = useSelector(state => state.incomes.incomesTotals) || {};

  const overviewType = getTimespan(pathname) || selectedTab;

  const expensesYears = Object
    .keys(expensesTotals)
    .map(Number)
    .filter(Boolean);

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...expensesYears,
    ]))
  }, [expensesYears]);

  const [yearDropdownWidth, setYearDropdownWidth] = useState(0);
  const [visibleYear, setVisibleYear] = useState(yearsToSelect?.[0]);

  const animatedScrollViewRef = useAnimatedRef();
  const scrollViewY = useSharedValue(0);

  const expensesMonths = Object
    .keys(expenses[selectedYear] || {})
    .map(monthString => Number(monthString))
    .reverse();
  const firstMonthNumber = expensesMonths[0];

  const routeYear = parseInt(params?.year);
  const routeMonthNumber = parseInt(params?.monthNumber, 10) || selectedMonth || firstMonthNumber;
  const routeWeekNumber = parseInt(params?.weekNumber, 10) || selectedWeek;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTabAction(overviewType));
    }
  }, [params]);

  useEffect(() => {
    if (Number(routeYear)) {
      dispatch(setSelectedYearAction(Number(routeYear)));

      navigation.setParams({
        year: undefined,
      });
    }
  }, [routeYear])

  useDerivedValue(() => {
    scrollTo(animatedScrollViewRef, 0, scrollViewY.value, true);
  });

  function onYearDropdownLayout (event) {
    const { width } = event.nativeEvent.layout;

    setYearDropdownWidth(width);
  }

  function renderWeeks () {
    return [1, 2, 3, 4].map((weekNumber, index) => {
      const previousMonthNumber = routeMonthNumber > 1
        ? routeMonthNumber - 1
        : getLastMonthNumberInYear(expensesTotals?.[selectedYear - 1]); // the last month of the previous year

      return (
        <ExpensesWeek
          key={index}
          style={[
            styles.expenses,
            windowWidth < MEDIA.WIDE_MOBILE && styles.expensesMobile,
          ]}
          year={selectedYear}
          monthNumber={routeMonthNumber}
          weekNumber={weekNumber}
          monthIncome={incomesTotals?.[selectedYear]?.[routeMonthNumber]?.total || 0}
          weekExpenses={expenses?.[selectedYear]?.[routeMonthNumber]?.[weekNumber]}
          weekExpensesTotal={expensesTotals?.[selectedYear]?.[routeMonthNumber]?.[weekNumber]}
          previousWeekTotalExpenses={routeMonthNumber > 1
            ? expensesTotals?.[selectedYear]?.[previousMonthNumber]?.[weekNumber] || 0
            : expensesTotals?.[selectedYear - 1]?.[previousMonthNumber]?.[weekNumber] || 0
          }
          previousMonthName={MONTH_NAME[previousMonthNumber]}
          onScrollTo={weekNumber === routeWeekNumber
            ? (scrollY) => scrollViewY.value = scrollY
            : undefined}
        />
      );
    });
  }

  function renderMonths () {
    return expensesMonths.map((monthNumber, index) => {
      const previousMonthNumber = monthNumber > 1
        ? expensesMonths[index + 1] // + 1 because month numbers are sorted in ASC order
        : getLastMonthNumberInYear(expensesTotals?.[selectedYear - 1]); // the last month of the previous year

      return (
        <ExpensesMonth
          key={index}
          style={[
            styles.expenses,
            windowWidth < MEDIA.WIDE_MOBILE && styles.expensesMobile,
          ]}
          year={selectedYear}
          monthNumber={monthNumber}
          monthIncome={incomesTotals?.[selectedYear]?.[monthNumber]?.total || 0}
          monthExpenses={expenses?.[selectedYear]?.[monthNumber]}
          monthExpensesTotal={expensesTotals?.[selectedYear]?.[monthNumber]?.total || 0}
          previousMonthTotalExpenses={monthNumber > 1
            ? expensesTotals?.[selectedYear]?.[previousMonthNumber]?.total || 0
            : expensesTotals?.[selectedYear - 1]?.[previousMonthNumber]?.total || 0 // compare to the last month of the previous year
          }
          previousMonthName={MONTH_NAME[previousMonthNumber]}
          onScrollTo={monthNumber === routeMonthNumber
            ? (scrollY) => scrollViewY.value = scrollY
            : undefined}
        />
      );
    });
  }

  function renderYears () {
    return yearsToSelect
      .map(yearString => Number(yearString))
      .sort((year1, year2) => year2 - year1) // sort desc
      .map(yearNumber => (
        <ViewPortDetector
          key={yearNumber}
          onChange={(visible) => {
            if (visible) {
              setVisibleYear(yearNumber);
            }
          }}
          percentHeight={1}
          frequency={500}
        >
          <ExpensesYear
            style={[
              styles.expenses,
              windowWidth < MEDIA.WIDE_MOBILE && styles.expensesMobile,
            ]}
            visible={visibleYear === yearNumber}
            year={yearNumber}
            yearExpenses={expenses[yearNumber]}
            yearTotalExpenses={expensesTotals[yearNumber]}
            yearIncome={incomesTotals?.[yearNumber]?.total || 0}
            previousYear={yearNumber - 1}
            previousYearTotalExpenses={incomesTotals?.[yearNumber - 1]?.total || 0}
          />
        </ViewPortDetector>
      ));
  }

  const overviewScreenPadding = windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
    ? windowWidth < MEDIA.TABLET
      ? windowWidth < MEDIA.WIDE_MOBILE ? 24 : 32 // tablet/mobile
      : 52 // desktop
    : 40; // wide desktop
  const listContainerPaddingTop = windowWidth <= MEDIA.WIDE_MOBILE
    ? 24 // mobile
    : windowWidth <= MEDIA.DESKTOP
      ? 56 // TABLET
      : 40; // DESKTOP

  const noDataForSelectedYear = !Object.keys(expenses[selectedYear] || {}).length;
  const noDataForAnyYear = !Object.keys(expenses).length;

  const hideYearSelector = selectedTab === TAB.YEARS;

  return (
    <Animated.ScrollView
      style={{ flexGrow: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      ref={animatedScrollViewRef}
    >
      <View
        style={[styles.expensesScreen, {
          paddingHorizontal: overviewScreenPadding,
        }]}
      >
        <Loader
          overlayStyle={{ left: Platform.select({ ios: overviewScreenPadding, web: 0 }) }}
          loading={loading}
        />

        {(windowWidth < MEDIA.TABLET && !hideYearSelector) && (
          <HeaderDropdown
            style={[
              styles.yearsDropdown,
              { top: Platform.OS === 'ios' ? 26 : 24 },
              noDataForSelectedYear && {
                right: '50%',
                transform: [{translateX: yearDropdownWidth / 2}],
              },
            ]}
            selectedValue={selectedYear}
            values={yearsToSelect}
            onSelect={(selectedYear) => dispatch(setSelectedYearAction(Number(selectedYear)))}
            onLayout={onYearDropdownLayout}
          />
        )}

        <ViewPortDetectorProvider flex={1}>
          <View style={[styles.listContainer, { paddingTop: listContainerPaddingTop }]}>
            {((noDataForSelectedYear && selectedTab !== TAB.YEARS)
              || (noDataForAnyYear && selectedTab === TAB.YEARS)
            ) && <NoDataPlaceholder />}

            {!noDataForSelectedYear && selectedTab === TAB.WEEKS && (
              renderWeeks()
            )}

            {!noDataForSelectedYear && selectedTab === TAB.MONTHS && (
              renderMonths()
            )}

            {!noDataForAnyYear && selectedTab === TAB.YEARS && (
              renderYears()
            )}
          </View>
        </ViewPortDetectorProvider>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  expensesScreen: {
    height: '100%',
    backgroundColor: COLOR.WHITE,
    flexGrow: 1,
  },

  yearsDropdown: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
  },

  listContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
  },

  expenses: {
    paddingBottom: 120,
  },
  expensesMobile: {
    paddingBottom: 80,
  },
});
