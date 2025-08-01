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
  useRouter,
} from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { ViewPortDetector, ViewPortDetectorProvider } from 'react-native-viewport-detector';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  setSelectedMonthAction,
  setSelectedTabAction,
  setSelectedYearAction,
} from '../../../../redux/reducers/ui';
import IncomesMonth from '../../../../components/incomes/IncomesMonth/IncomesMonth';
import IncomesWeek from '../../../../components/incomes/IncomesWeek/IncomesWeek';
import IncomesYear from '../../../../components/incomes/IncomesYear/IncomesYear';
import NoDataPlaceholder from '../../../../components/NoDataPlaceholder';
import HeaderDropdown from '../../../../components/HeaderDropdown';
import { TAB } from '../../../../components/HeaderTabs';
import Loader from '../../../../components/Loader';
import { getLastMonthNumberInYear, MONTH_NAME } from '../../../../services/date';
import { getTimespan } from '../../../../services/location';
import { COLOR } from '../../../../styles/colors';
import { MEDIA } from '../../../../styles/media';

export default function IncomesScreen () {
  const router = useRouter();
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

  const incomes = useSelector(state => state.incomes.incomes) || {};
  const incomesTotals = useSelector(state => state.incomes.incomesTotals) || {};

  const overviewType = getTimespan(pathname) || selectedTab;

  const incomesYears = Object
    .keys(incomesTotals)
    .map(Number)
    .filter(Boolean);

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...incomesYears,
    ]))
  }, [incomesYears]);

  const [yearDropdownWidth, setYearDropdownWidth] = useState(0);
  const [visibleYear, setVisibleYear] = useState(yearsToSelect?.[0]);

  const animatedScrollViewRef = useAnimatedRef();
  const scrollViewY = useSharedValue(0);

  const incomesMonths = Object
    .keys(incomes[selectedYear] || {})
    .map(monthString => Number(monthString))
    .reverse();
  const mostRecentMonthNumber = incomesMonths[0];

  const routeYear = parseInt(params?.year, 10);
  const routeMonthNumber = parseInt(params?.monthNumber, 10) || selectedMonth || mostRecentMonthNumber;
  const routeWeekNumber = parseInt(params?.weekNumber, 10) || selectedWeek;

  const noDataForSelectedMonth = !Object.keys(incomes?.[selectedYear]?.[routeMonthNumber] || {}).length;

  // handle deleting the last and only expense in this month - switch to the most recently available month
  useEffect(() => {
    if (noDataForSelectedMonth && mostRecentMonthNumber) {
      dispatch(setSelectedMonthAction(mostRecentMonthNumber));
      router.setParams({ monthNumber: mostRecentMonthNumber });
    }
  }, [noDataForSelectedMonth, mostRecentMonthNumber]);

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
        : getLastMonthNumberInYear(incomesTotals?.[selectedYear - 1]); // the last month of the previous year

      return (
        <IncomesWeek
          key={index}
          style={[
            styles.incomes,
            windowWidth < MEDIA.WIDE_MOBILE && styles.incomesMobile,
          ]}
          year={selectedYear}
          monthNumber={routeMonthNumber}
          weekNumber={weekNumber}
          monthIncome={incomesTotals?.[selectedYear]?.[routeMonthNumber]?.total || 0}
          weekIncomes={incomes?.[selectedYear]?.[routeMonthNumber]?.[weekNumber]}
          weekIncomesTotal={incomesTotals?.[selectedYear]?.[routeMonthNumber]?.[weekNumber]}
          previousMonthTotalIncomes={routeMonthNumber > 1
            ? incomesTotals?.[selectedYear]?.[previousMonthNumber]?.[weekNumber] || 0
            : incomesTotals?.[selectedYear - 1]?.[previousMonthNumber]?.[weekNumber] || 0
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
    return incomesMonths.map((monthNumber, index) => {
      const previousMonthNumber = monthNumber > 1
        ? incomesMonths[index + 1] // + 1 because month numbers are sorted in ASC order
        : getLastMonthNumberInYear(incomesTotals?.[selectedYear - 1]); // the last month of the previous year

      return (
        <IncomesMonth
          key={index}
          style={[
            styles.incomes,
            windowWidth < MEDIA.WIDE_MOBILE && styles.incomesMobile,
          ]}
          year={selectedYear}
          monthNumber={monthNumber}
          yearIncome={incomesTotals?.[selectedYear]?.total || 0}
          monthIncomes={incomes?.[selectedYear]?.[monthNumber]}
          monthIncomesTotal={incomesTotals?.[selectedYear]?.[monthNumber]?.total || 0}
          previousMonthTotalIncomes={monthNumber > 1
            ? incomesTotals?.[selectedYear]?.[previousMonthNumber]?.total || 0
            : incomesTotals?.[selectedYear - 1]?.[previousMonthNumber]?.total || 0 // compare to the last month of the previous year
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
          <IncomesYear
            style={[
              styles.incomes,
              windowWidth < MEDIA.WIDE_MOBILE && styles.incomesMobile,
            ]}
            visible={visibleYear === yearNumber}
            year={yearNumber}
            allTimeTotalIncome={incomesTotals?.total || 0}
            yearIncomes={incomes[yearNumber]}
            yearIncomesTotal={incomesTotals[yearNumber]?.total || 0}
            previousYearTotalIncomes={incomesTotals?.[yearNumber - 1]?.total || 0}
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
  const listContainerPaddingTop = windowWidth <= MEDIA.WIDE_MOBILE
    ? 24 // mobile
    : windowWidth <= MEDIA.DESKTOP
      ? 56 // TABLET
      : 40; // DESKTOP

  const noDataForSelectedYear = !Object.keys(incomes[selectedYear] || {}).length;
  const noDataForAnyYear = !Object.keys(incomes).length;
  const noData = noDataForSelectedYear || noDataForAnyYear;

  const hideYearSelector = selectedTab === TAB.YEARS;

  return (
    <Animated.ScrollView
      style={{ flexGrow: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      ref={animatedScrollViewRef}
    >
      <View
        style={[styles.incomesScreen, {
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
            {noData && <NoDataPlaceholder />}

            {!noData && (
              <>
                {selectedTab === TAB.WEEKS && (
                  renderWeeks()
                )}

                {selectedTab === TAB.MONTHS && (
                  renderMonths()
                )}

                {selectedTab === TAB.YEARS && (
                  renderYears()
                )}
              </>
            )}
          </View>
        </ViewPortDetectorProvider>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  incomesScreen: {
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

  incomes: {
    paddingBottom: 120,
  },
  incomesMobile: {
    paddingBottom: 80,
  },
});
