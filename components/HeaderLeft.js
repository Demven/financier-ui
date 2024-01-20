import { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
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
  title: PropTypes.string,
  simplified: PropTypes.bool,
};

export default function HeaderLeft (props) {
  const {
    style,
    title,
    simplified = false,
  } = props;

  const windowWidth = useSelector(state => state.ui.windowWidth);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const selectedTab = useSelector(state => state.ui.selectedTab);
  const hideYearSelector = selectedTab === TAB.YEARS;

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

  const dispatch = useDispatch();

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
          lineHeight: windowWidth < MEDIA.TABLET ? 18 : 26,
        }]}
      >
        {title}
      </HeaderTitle>

      {(windowWidth >= MEDIA.TABLET && !simplified && !hideYearSelector) && (
        <HeaderDropdown
          style={styles.headerDropdown}
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
  },
  headerDropdown: {
    marginLeft: 24,
  },
});
