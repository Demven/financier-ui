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
import SavingsMonth from '../../../../components/savings/SavingsMonth/SavingsMonth';
import SavingsWeek from '../../../../components/savings/SavingsWeek/SavingsWeek';
import SavingsYear from '../../../../components/savings/SavingsYear/SavingsYear';
import NoDataPlaceholder from '../../../../components/NoDataPlaceholder';
import HeaderDropdown from '../../../../components/HeaderDropdown';
import { TAB } from '../../../../components/HeaderTabs';
import Loader from '../../../../components/Loader';
import { getLastMonthNumberInYear, MONTH_NAME } from '../../../../services/date';
import { getTimespan } from '../../../../services/location';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

export default function SavingsScreen () {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const params = useGlobalSearchParams();
  const pathname = usePathname();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const selectedMonth = useSelector(state => state.ui.selectedMonth);
  const selectedWeek = useSelector(state => state.ui.selectedWeek);
  const loading = useSelector(state => state.ui.loading);

  const savings = useSelector(state => state.savings.savings) || {};
  const savingsTotals = useSelector(state => state.savings.savingsTotals) || {};
  const investments = useSelector(state => state.savings.investments) || {};
  const investmentsTotals = useSelector(state => state.savings.investmentsTotals) || {};

  const overviewType = getTimespan(pathname) || selectedTab;

  const savingsYears = Object
    .keys(savingsTotals)
    .map(Number)
    .filter(Boolean);
  const investmentsYears = Object
    .keys(investmentsTotals)
    .map(Number)
    .filter(Boolean);

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...savingsYears,
      ...investmentsYears,
    ]))
  }, [savingsYears, investmentsYears]);

  const [yearDropdownWidth, setYearDropdownWidth] = useState(0);
  const [visibleYear, setVisibleYear] = useState(yearsToSelect?.[0]);

  const animatedScrollViewRef = useAnimatedRef();
  const scrollViewY = useSharedValue(0);

  const savingMonths = Object
    .keys(savings[selectedYear] || {})
    .map(monthString => Number(monthString));
  const investmentsMonths = Object
    .keys(investments[selectedYear] || {})
    .map(monthString => Number(monthString));
  const months = Array
    .from(new Set([...savingMonths, ...investmentsMonths]))
    .sort((a, b) => a - b) // asc
    .reverse();
  const firstMonthNumber = months[0];

  const routeMonthNumber = parseInt(params?.monthNumber, 10) || selectedMonth || firstMonthNumber;
  const routeWeekNumber = parseInt(params?.weekNumber, 10) || selectedWeek;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTabAction(overviewType));
    }
  }, [params]);

  useEffect(() => {
    if (Number(params?.year)) {
      dispatch(setSelectedYearAction(parseInt(params.year, 10)));

      navigation.setParams({
        year: undefined,
      });
    }
  }, [params?.year])

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
          // the last month of the previous year
        : getLastMonthNumberInYear(savingsTotals?.[selectedYear - 1] || investmentsTotals?.[selectedYear - 1]);

      return (
        <SavingsWeek
          key={index}
          style={[
            styles.savings,
            windowWidth < MEDIA.WIDE_MOBILE && styles.savingsMobile,
          ]}
          year={selectedYear}
          monthNumber={routeMonthNumber}
          weekNumber={weekNumber}
          savings={savings?.[selectedYear]?.[routeMonthNumber]}
          investments={investments?.[selectedYear]?.[routeMonthNumber]}
          monthTotalSavingsAndInvestments={(savingsTotals?.[selectedYear]?.[routeMonthNumber]?.total || 0) + (investmentsTotals?.[selectedYear]?.[routeMonthNumber]?.total || 0)}
          previousWeekTotalSavingsAndInvestments={routeMonthNumber > 1
            ? (savingsTotals?.[selectedYear]?.[previousMonthNumber]?.[weekNumber] || 0)
            : investmentsTotals?.[selectedYear - 1]?.[previousMonthNumber]?.[weekNumber] || 0
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
    return months.map((monthNumber, index) => {
      const previousMonthNumber = monthNumber > 1
        ? months[index + 1] // + 1 because month numbers are sorted in ASC order
          // the last month of the previous year
        : getLastMonthNumberInYear(savingsTotals?.[selectedYear - 1] || investmentsTotals?.[selectedYear - 1]);

      return (
        <SavingsMonth
          key={index}
          style={[
            styles.savings,
            windowWidth < MEDIA.WIDE_MOBILE && styles.savingsMobile,
          ]}
          year={selectedYear}
          monthNumber={monthNumber}
          savings={savings?.[selectedYear]?.[monthNumber]}
          yearSavingsTotal={savingsTotals?.[selectedYear]?.total}
          investments={investments?.[selectedYear]?.[monthNumber]}
          yearInvestmentsTotal={investmentsTotals?.[selectedYear]?.total}
          previousMonthTotalSavingsAndInvestments={monthNumber > 1
            ? (savingsTotals?.[selectedYear]?.[previousMonthNumber]?.total || 0) + (investmentsTotals?.[selectedYear]?.[previousMonthNumber]?.total || 0)
              // compare to the last month of the previous year
            : (savingsTotals?.[selectedYear - 1]?.[previousMonthNumber]?.total || 0) + (investmentsTotals?.[selectedYear - 1]?.[previousMonthNumber]?.total || 0)
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
          <SavingsYear
            style={[
              styles.savings,
              windowWidth < MEDIA.WIDE_MOBILE && styles.savingsMobile,
            ]}
            visible={visibleYear === yearNumber}
            year={yearNumber}
            savings={savings[yearNumber]}
            savingsTotals={savingsTotals?.[yearNumber]}
            investments={investments[yearNumber]}
            investmentsTotals={investmentsTotals?.[yearNumber]}
            allTimeTotalSavingsAndInvestments={(savingsTotals?.total || 0) + (investmentsTotals?.total || 0)}
            previousYearTotalSavingsAndInvestments={(savingsTotals?.[yearNumber - 1]?.total || 0) + (investmentsTotals?.[yearNumber - 1]?.total || 0)}
            previousYear={yearNumber - 1}
          />
        </ViewPortDetector>
      ));
  }

  const overviewScreenPadding = windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
    ? windowWidth < MEDIA.TABLET
      ? windowWidth < MEDIA.WIDE_MOBILE ? 24 : 32 // tablet/mobile
      : 52 // desktop
    : 40; // wide desktop
  const listContainerPaddingTop = windowWidth < MEDIA.TABLET ? 24 : 40;

  const noDataForSelectedYear = !Object.keys(savings[selectedYear] || {}).length
    && !Object.keys(investments[selectedYear] || {}).length;
  const noDataForAnyYear = !Object.keys(savings).length
    && !Object.keys(investments).length;

  const hideYearSelector = selectedTab === TAB.YEARS;

  return (
    <Animated.ScrollView
      style={{ flexGrow: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      ref={animatedScrollViewRef}
    >
      <View
        style={[styles.savingsScreen, {
          paddingHorizontal: overviewScreenPadding,
        }]}
      >
        <Loader loading={loading} />

        {(windowWidth < MEDIA.TABLET && !hideYearSelector) && (
          <HeaderDropdown
            style={[styles.yearsDropdown, {
              top: Platform.OS === 'ios' ? 26 : 24,
            }, noDataForSelectedYear && {
              right: '50%',
              transform: [{translateX: yearDropdownWidth / 2}],
            }]}
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
  savingsScreen: {
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

  savings: {
    paddingBottom: 120,
  },
  savingsMobile: {
    paddingBottom: 80,
  },
});
