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
import IncomesMonth from './IncomesMonth/IncomesMonth';
import IncomesWeek from './IncomesWeek/IncomesWeek';
import IncomesYear from './IncomesYear/IncomesYear';
import NoDataPlaceholder from '../../components/NoDataPlaceholder';
import HeaderDropdown from '../../components/HeaderDropdown';
import { TAB } from '../../components/HeaderTabs';
import { COLOR } from '../../styles/colors';
import { MEDIA } from '../../styles/media';

export default function IncomesScreen () {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const savings = useSelector(state => state.savings.savings) || {};
  const investments = useSelector(state => state.savings.investments) || {};

  const savingsYears = Object.keys(savings);
  const investmentsYears = Object.keys(investments);

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
    return [1, 2, 3, 4].map((weekNumber, index) => (
      <IncomesWeek
        key={index}
        style={styles.overview}
        year={selectedYear}
        monthNumber={monthNumber}
        weekNumber={weekNumber}
        onScrollTo={weekNumber === routeWeekNumber
          ? (scrollY) => scrollViewY.value = scrollY
          : undefined}
        savings={savings?.[selectedYear]?.[monthNumber]}
        investments={investments?.[selectedYear]?.[monthNumber]}
      />
    ));
  }

  function renderMonths () {
    return months.map((monthNumber, index) => (
      <IncomesMonth
        key={index}
        style={styles.overview}
        year={selectedYear}
        monthNumber={monthNumber}
        savings={savings?.[selectedYear]?.[monthNumber]}
        investments={investments?.[selectedYear]?.[monthNumber]}
      />
    ));
  }

  function renderYears () {
    return yearsToSelect
      .map(yearString => Number(yearString))
      .map((yearNumber, index) => (
        <IncomesYear
          key={index}
          style={styles.overview}
          year={yearNumber}
          savings={savings[yearNumber]}
          investments={investments[yearNumber]}
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
        style={[styles.incomesScreen, {
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

  overview: {
    paddingBottom: 80,
  },
});
