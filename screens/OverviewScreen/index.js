import { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTabAction, setSelectedYearAction } from '../../redux/reducers/ui';
import OverviewMonth from './OverviewMonth/OverviewMonth';
import OverviewWeek from './OverviewWeek/OverviewWeek';
import OverviewYear from './OverviewYear/OverviewYear';
import NoDataPlaceholder from '../../components/NoDataPlaceholder';
import { TAB } from '../../components/HeaderTabs';
import HeaderDropdown from '../../components/HeaderDropdown';
import { COLOR } from '../../styles/colors';
import { MEDIA } from '../../styles/media';

export default function OverviewScreen () {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const expenses = useSelector(state => state.expenses.expenses) || {};
  const incomes = useSelector(state => state.incomes.incomes) || {};
  const savings = useSelector(state => state.savings.savings) || {};
  const investments = useSelector(state => state.savings.investments) || {};

  const expensesYears = Object.keys(expenses);
  const incomesYears = Object.keys(incomes);
  const savingsYears = Object.keys(savings);
  const investmentsYears = Object.keys(investments);

  const [yearDropdownWidth, setYearDropdownWidth] = useState(0);

  const route = useRoute();
  const overviewType = route.params?.type;

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...expensesYears,
      ...incomesYears,
      ...savingsYears,
      ...investmentsYears,
    ]))
  }, [expensesYears, incomesYears, savingsYears, investmentsYears]);

  const expensesMonths = Object
    .keys(expenses[selectedYear] || {})
    .map(monthString => Number(monthString));
  const incomesMonths = Object
    .keys(incomes[selectedYear] || {})
    .map(monthString => Number(monthString));
  const savingMonths = Object
    .keys(savings[selectedYear] || {})
    .map(monthString => Number(monthString));
  const investmentsMonths = Object
    .keys(investments[selectedYear] || {})
    .map(monthString => Number(monthString));
  const months = Array
    .from(new Set([...expensesMonths, ...incomesMonths, ...savingMonths, ...investmentsMonths]))
    .sort((a, b) => a - b) // asc
    .reverse();
  const firstMonthNumber = months[0];

  const monthNumber = route.params?.monthNumber || firstMonthNumber;

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

  function onYearDropdownLayout (event) {
    const { width } = event.nativeEvent.layout;

    setYearDropdownWidth(width);
  }

  function renderWeeks () {
    return [1, 2, 3, 4].map((weekNumber, index) => (
      <OverviewWeek
        key={index}
        style={[styles.overview, {
          paddingBottom: windowWidth < MEDIA.DESKTOP ? 80 : 40,
        }]}
        year={selectedYear}
        monthNumber={monthNumber}
        weekNumber={weekNumber}
        expenses={expenses?.[selectedYear]?.[monthNumber]}
        incomes={incomes?.[selectedYear]?.[monthNumber]}
        savings={savings?.[selectedYear]?.[monthNumber]}
        investments={investments?.[selectedYear]?.[monthNumber]}
      />
    ));
  }

  function renderMonths () {
    return months.map((monthNumber, index) => (
      <OverviewMonth
        key={index}
        style={[styles.overview, {
          paddingBottom: windowWidth < MEDIA.DESKTOP ? 80 : 40,
        }]}
        year={selectedYear}
        monthNumber={monthNumber}
        expenses={expenses?.[selectedYear]?.[monthNumber]}
        incomes={incomes?.[selectedYear]?.[monthNumber]}
        savings={savings?.[selectedYear]?.[monthNumber]}
        investments={investments?.[selectedYear]?.[monthNumber]}
      />
    ));
  }

  function renderYears () {
    return yearsToSelect
      .map(yearString => Number(yearString))
      .map((yearNumber, index) => (
        <OverviewYear
          key={index}
          style={[styles.overview, {
            paddingBottom: windowWidth < MEDIA.DESKTOP ? 80 : 40,
          }]}
          year={yearNumber}
          expenses={expenses[yearNumber]}
          incomes={incomes[yearNumber]}
          savings={savings[yearNumber]}
          investments={investments[yearNumber]}
        />
      ));
  }

  const overviewScreenPadding = windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
    ? windowWidth < MEDIA.TABLET ? 0 : 52
    : 40;
  const listContainerPaddingTop = windowWidth < MEDIA.TABLET ? 24 : 40;

  const noDataForSelectedYear = !Object.keys(expenses[selectedYear] || {}).length
    && !Object.keys(incomes[selectedYear] || {}).length
    && !Object.keys(savings[selectedYear] || {}).length
    && !Object.keys(investments[selectedYear] || {}).length;
  const noDataForAnyYear = !Object.keys(expenses).length
    && !Object.keys(incomes).length
    && !Object.keys(savings).length
    && !Object.keys(investments).length;

  const hideYearSelector = selectedTab === TAB.YEARS;

  return (
    <ScrollView
      style={{ flexGrow: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        style={[styles.overviewScreen, {
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overviewScreen: {
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

  overview: {},
});
