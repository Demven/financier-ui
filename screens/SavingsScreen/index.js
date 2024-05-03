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
import SavingsMonth from './SavingsMonth/SavingsMonth';
import SavingsWeek from './SavingsWeek/SavingsWeek';
import SavingsYear from './SavingsYear/SavingsYear';
import NoDataPlaceholder from '../../components/NoDataPlaceholder';
import HeaderDropdown from '../../components/HeaderDropdown';
import { TAB } from '../../components/HeaderTabs';
import { getLastMonthNumberInYear, MONTH_NAME } from '../../services/date';
import { COLOR } from '../../styles/colors';
import { MEDIA } from '../../styles/media';

export default function SavingsScreen () {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const savings = useSelector(state => state.savings.savings) || {};
  const savingsTotal = useSelector(state => state.savings.savingsTotal) || {};
  const investments = useSelector(state => state.savings.investments) || {};
  const investmentsTotal = useSelector(state => state.savings.investmentsTotal) || {};

  const savingsYears = Object
    .keys(savingsTotal)
    .map(Number)
    .filter(Boolean);
  const investmentsYears = Object
    .keys(investmentsTotal)
    .map(Number)
    .filter(Boolean);

  const [yearDropdownWidth, setYearDropdownWidth] = useState(0);

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...savingsYears,
      ...investmentsYears,
    ]))
  }, [savingsYears, investmentsYears]);

  const route = useRoute();
  const overviewType = route.params?.type;

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

  const monthNumber = route.params?.monthNumber || firstMonthNumber;
  const routeWeekNumber = route.params?.weekNumber;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTabAction(overviewType));
    }
  }, [route]);

  useEffect(() => {
    if (route?.params?.year) {
      dispatch(setSelectedYearAction(Number(route.params.year)));

      navigation.setParams({
        year: undefined,
      });
    }
  }, [route?.params?.year])

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
          // the last month of the previous year
        : getLastMonthNumberInYear(savingsTotal?.[selectedYear - 1] || investmentsTotal?.[selectedYear - 1]);

      return (
        <SavingsWeek
          key={index}
          style={[
            styles.savings,
            windowWidth < MEDIA.WIDE_MOBILE && styles.savingsMobile,
          ]}
          year={selectedYear}
          monthNumber={monthNumber}
          weekNumber={weekNumber}
          onScrollTo={weekNumber === routeWeekNumber
            ? (scrollY) => scrollViewY.value = scrollY
            : undefined}
          savings={savings?.[selectedYear]?.[monthNumber]}
          investments={investments?.[selectedYear]?.[monthNumber]}
          monthTotalSavingsAndInvestments={(savingsTotal?.[selectedYear]?.[monthNumber]?.total || 0) + (investmentsTotal?.[selectedYear]?.[monthNumber]?.total || 0)}
          previousWeekTotalSavingsAndInvestments={monthNumber > 1
            ? (savingsTotal?.[selectedYear]?.[previousMonthNumber]?.[weekNumber] || 0)
            : investmentsTotal?.[selectedYear - 1]?.[previousMonthNumber]?.[weekNumber] || 0
          }
          previousMonthName={MONTH_NAME[previousMonthNumber]}
        />
      );
    });
  }

  function renderMonths () {
    return months.map((monthNumber, index) => {
      const previousMonthNumber = monthNumber > 1
        ? months[index + 1] // + 1 because month numbers are sorted in ASC order
          // the last month of the previous year
        : getLastMonthNumberInYear(savingsTotal?.[selectedYear - 1] || investmentsTotal?.[selectedYear - 1]);

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
          yearSavingsTotal={savingsTotal?.[selectedYear]?.total}
          investments={investments?.[selectedYear]?.[monthNumber]}
          yearInvestmentsTotal={investmentsTotal?.[selectedYear]?.total}
          previousMonthTotalSavingsAndInvestments={monthNumber > 1
            ? (savingsTotal?.[selectedYear]?.[previousMonthNumber]?.total || 0) + (investmentsTotal?.[selectedYear]?.[previousMonthNumber]?.total || 0)
              // compare to the last month of the previous year
            : (savingsTotal?.[selectedYear - 1]?.[previousMonthNumber]?.total || 0) + (investmentsTotal?.[selectedYear - 1]?.[previousMonthNumber]?.total || 0)
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
        <SavingsYear
          key={index}
          style={[
            styles.savings,
            windowWidth < MEDIA.WIDE_MOBILE && styles.savingsMobile,
          ]}
          year={yearNumber}
          savings={savings[yearNumber]}
          investments={investments[yearNumber]}
          allTimeTotalSavingsAndInvestments={(savingsTotal?.total || 0) + (investmentsTotal?.total || 0)}
          previousYearTotalSavingsAndInvestments={(savingsTotal?.[yearNumber - 1]?.total || 0) + (investmentsTotal?.[yearNumber - 1]?.total || 0)}
          previousYear={yearNumber - 1}
        />
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
