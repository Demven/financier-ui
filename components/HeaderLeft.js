import { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { memoize } from 'proxy-memoize';
import { HeaderTitle } from '@react-navigation/elements';
import { useDispatch, useSelector } from 'react-redux';
import { useDrawerStatus } from '@react-navigation/drawer';
import Logo from './Logo';
import HeaderDropdown from './HeaderDropdown';
import { setSelectedYearAction } from '../redux/reducers/ui';
import { TAB } from './HeaderTabs';
import { FONT } from '../styles/fonts';
import { MEDIA } from '../styles/media';

HeaderLeft.propTypes = {
  style: PropTypes.object,
  routeSegment: PropTypes.string,
  simplified: PropTypes.bool,
};

export default function HeaderLeft (props) {
  const {
    style,
    routeSegment,
    simplified = false,
  } = props;

  const dispatch = useDispatch();

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const selectedTab = useSelector(state => state.ui.selectedTab);
  const hideYearSelector = selectedTab === TAB.YEARS;

  const getExpensesYears = memoize(state => Object
    .keys(state.expenses.expensesTotals)
    .map(Number)
    .filter(Boolean));
  const expensesYears = useSelector(getExpensesYears);

  const getIncomesYears = memoize(state => Object
    .keys(state.incomes.incomesTotals)
    .map(Number)
    .filter(Boolean));
  const incomesYears = useSelector(getIncomesYears);

  const getSavingsYears = memoize(state => Object
    .keys(state.savings.savingsTotals)
    .map(Number)
    .filter(Boolean));
  const savingsYears = useSelector(getSavingsYears);

  const getInvestmentsYears = memoize(state => Object
    .keys(state.savings.investmentsTotals)
    .map(Number)
    .filter(Boolean));
  const investmentsYears = useSelector(getInvestmentsYears);

  const yearsToSelect = useMemo(() => {
    return Array.from(new Set([
      new Date().getFullYear(),
      ...expensesYears,
      ...incomesYears,
      ...savingsYears,
      ...investmentsYears,
    ]))
  }, [expensesYears, incomesYears, savingsYears, investmentsYears]);

  const title = routeSegment.split('/')[0];

  const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <View style={[styles.headerLeft, style]}>
      {!isDrawerOpen && (
        <Logo containerStyle={styles.logo} />
      )}

      <HeaderTitle
        style={[styles.headerTitle, {
          marginTop: windowWidth < MEDIA.TABLET
            ? Platform.OS === 'ios' ? 8 : 4
            : 2,
          marginLeft: windowWidth < MEDIA.TABLET ? 16 : 41,
          fontSize: windowWidth < MEDIA.TABLET ? 18 : 20,
          lineHeight: windowWidth < MEDIA.TABLET ? 22 : 26,
        }]}
      >
        {title}
      </HeaderTitle>

      {(windowWidth >= MEDIA.TABLET && !simplified && !hideYearSelector) && (
        <HeaderDropdown
          style={[styles.headerDropdown, {
            marginTop: Platform.select({ 'ios': 9 }),
          }]}
          selectedValue={selectedYear}
          values={yearsToSelect}
          onSelect={(selectedYear) => dispatch(setSelectedYearAction(Number(selectedYear)))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONT.NOTO_SERIF.BOLD,
    flexShrink: 0,
    textTransform: 'capitalize',
  },
  headerDropdown: {
    marginLeft: 24,
  },
});
