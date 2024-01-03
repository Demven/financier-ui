import { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTabAction, setSelectedYearAction } from '../../redux/reducers/ui';
import OverviewMonth from './OverviewMonth/OverviewMonth';
import OverviewWeek from './OverviewWeek/OverviewWeek';
import { TAB } from '../../components/HeaderTabs';
import HeaderDropdown from '../../components/HeaderDropdown';
import { COLOR } from '../../styles/colors';
import { MEDIA } from '../../styles/media';

export default function OverviewScreen () {
  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);

  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const expenses = useSelector(state => state.expenses.expenses[selectedYear]) || {};
  const incomes = useSelector(state => state.incomes.incomes[selectedYear]) || {};
  const savings = useSelector(state => state.savings.savings[selectedYear]) || {};
  const investments = useSelector(state => state.savings.investments[selectedYear]) || {};

  const expensesYears = useSelector(state => Object.keys(state.expenses.expenses));
  const incomesYears = useSelector(state => Object.keys(state.incomes.incomes));
  const savingsYears = useSelector(state => Object.keys(state.savings.savings));
  const investmentsYears = useSelector(state => Object.keys(state.savings.investments));

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...expensesYears,
      ...incomesYears,
      ...savingsYears,
      ...investmentsYears,
    ]))
  }, [expensesYears, incomesYears, savingsYears, investmentsYears]);

  const months = Object
    .keys(expenses)
    .map(monthString => Number(monthString))
    .reverse();
  const latestMonthNumber = months[0];

  const route = useRoute();
  const overviewType = route.params?.type;
  const monthNumber = route.params?.monthNumber || latestMonthNumber;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTabAction({ selectedTab: overviewType }));
    }
  }, [route]);

  function renderWeeks () {
    return [1, 2, 3, 4].map((weekNumber, index) => (
      <OverviewWeek
        key={index}
        style={[styles.overview, {
          marginTop: index === 0
            ? 0
            : windowWidth < MEDIA.TABLET ? 80 : 60,
        }]}
        year={selectedYear}
        monthNumber={monthNumber}
        weekNumber={weekNumber}
        expenses={expenses?.[monthNumber]}
        incomes={incomes?.[monthNumber]}
        savings={savings?.[monthNumber]}
        investments={investments?.[monthNumber]}
      />
    ));
  }

  function renderMonths () {
    return months.map((monthNumber, index) => (
      <OverviewMonth
        key={index}
        style={[styles.overview, {
          marginTop: index === 0
            ? 0
            : windowWidth < MEDIA.TABLET ? 80 : 60,
        }]}
        year={selectedYear}
        monthNumber={monthNumber}
        expenses={expenses[monthNumber]}
        incomes={incomes[monthNumber]}
        savings={savings[monthNumber]}
        investments={investments[monthNumber]}
      />
    ));
  }

  const overviewScreenPadding = windowWidth < (MEDIA.MEDIUM_DESKTOP + 40 * 2)
    ? windowWidth < MEDIA.TABLET ? 0 : 24
    : 40;
  const listContainerPaddingTop = windowWidth < MEDIA.TABLET ? 24 : 40;

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View
        style={[styles.overviewScreen, {
          paddingHorizontal: overviewScreenPadding,
        }]}
      >
        {windowWidth < MEDIA.TABLET && (
          <HeaderDropdown
            style={styles.yearsDropdown}
            selectedValue={selectedYear}
            values={yearsToSelect}
            onSelect={(selectedYear) => dispatch(setSelectedYearAction({ selectedYear }))}
          />
        )}

        <View style={[styles.listContainer, { paddingTop: listContainerPaddingTop }]}>
          {selectedTab === TAB.WEEKS && (
            renderWeeks()
          )}

          {selectedTab === TAB.MONTHS && (
            renderMonths()
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
  },

  yearsDropdown: {
    position: 'absolute',
    right: 8,
    top: 36,
    zIndex: 1,
  },

  listContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 1280,
    paddingBottom: 80,
    alignSelf: 'center',
  },

  overview: {
    marginTop: 60,
  },
});
