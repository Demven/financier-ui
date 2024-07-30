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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { setSelectedTabAction, setSelectedYearAction } from '../../redux/reducers/ui';
import ExpensesMonth from './ExpensesMonth/ExpensesMonth';
import ExpensesWeek from './ExpensesWeek/ExpensesWeek';
import ExpensesYear from './ExpensesYear/ExpensesYear';
import NoDataPlaceholder from '../../components/NoDataPlaceholder';
import HeaderDropdown from '../../components/HeaderDropdown';
import { TAB } from '../../components/HeaderTabs';
import Loader from '../../components/Loader';
import { getLastMonthNumberInYear, MONTH_NAME } from '../../services/date';
import { COLOR } from '../../styles/colors';
import { MEDIA } from '../../styles/media';

export default function ExpensesScreen () {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const loading = useSelector(state => state.ui.loading);

  const expenses = useSelector(state => state.expenses.expenses) || {};
  const expensesTotals = useSelector(state => state.expenses.expensesTotals) || {};
  const incomesTotals = useSelector(state => state.incomes.incomesTotals) || {};

  const expensesYears = Object
    .keys(expensesTotals)
    .map(Number)
    .filter(Boolean);

  const [yearDropdownWidth, setYearDropdownWidth] = useState(0);

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...expensesYears,
    ]))
  }, [expensesYears]);

  const route = useRoute();
  const overviewType = route.params?.type;
  const routeYear = route.params?.year;

  const animatedScrollViewRef = useAnimatedRef();
  const scrollViewY = useSharedValue(0);

  const expensesMonths = Object
    .keys(expenses[selectedYear] || {})
    .map(monthString => Number(monthString))
    .reverse();
  const firstMonthNumber = expensesMonths[0];

  const monthNumber = route.params?.monthNumber || firstMonthNumber;
  const routeWeekNumber = route.params?.weekNumber;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTabAction(overviewType));
    }
  }, [route]);

  useEffect(() => {
    if (routeYear) {
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
      const previousMonthNumber = monthNumber > 1
        ? monthNumber - 1
        : getLastMonthNumberInYear(expensesTotals?.[selectedYear - 1]); // the last month of the previous year

      return (
        <ExpensesWeek
          key={index}
          style={[
            styles.expenses,
            windowWidth < MEDIA.WIDE_MOBILE && styles.expensesMobile,
          ]}
          year={selectedYear}
          monthNumber={monthNumber}
          weekNumber={weekNumber}
          monthIncome={incomesTotals?.[selectedYear]?.[monthNumber]?.total || 0}
          onScrollTo={weekNumber === routeWeekNumber
            ? (scrollY) => scrollViewY.value = scrollY
            : undefined}
          weekExpenses={expenses?.[selectedYear]?.[monthNumber]?.[weekNumber]}
          weekExpensesTotal={expensesTotals?.[selectedYear]?.[monthNumber]?.[weekNumber]}
          previousWeekTotalExpenses={monthNumber > 1
            ? expensesTotals?.[selectedYear]?.[previousMonthNumber]?.[weekNumber] || 0
            : expensesTotals?.[selectedYear - 1]?.[previousMonthNumber]?.[weekNumber] || 0
          }
          previousMonthName={MONTH_NAME[previousMonthNumber]}
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
        />
      );
    });
  }

  function renderYears () {
    return yearsToSelect
      .map(yearString => Number(yearString))
      .map((yearNumber, index) => (
        <ExpensesYear
          key={index}
          style={[
            styles.expenses,
            windowWidth < MEDIA.WIDE_MOBILE && styles.expensesMobile,
          ]}
          year={yearNumber}
          yearExpenses={expenses[yearNumber]}
          yearTotalExpenses={expensesTotals[yearNumber]}
          yearIncome={incomesTotals?.[yearNumber]?.total || 0}
          previousYear={yearNumber - 1}
          previousYearTotalExpenses={incomesTotals?.[yearNumber - 1]?.total || 0}
        />
      ));
  }

  const overviewScreenPadding = windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
    ? windowWidth < MEDIA.TABLET
      ? windowWidth < MEDIA.WIDE_MOBILE ? 24 : 32 // tablet/mobile
      : 52 // desktop
    : 40; // wide desktop
  const listContainerPaddingTop = windowWidth < MEDIA.TABLET ? 24 : 40;

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
        <Loader loading={loading} />

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
