import { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTab } from '../../redux/reducers/ui';
import OverviewMonth from './OverviewMonth/OverviewMonth';
import { COLOR } from '../../styles/colors';

export default function OverviewScreen () {
  const dispatch = useDispatch();
  const selectedTab = useSelector(state => state.ui.selectedTab);
  const selectedYear = useSelector(state => state.ui.selectedYear);
  const expenses = useSelector(state => state.expenses.expenses[selectedYear]);
  const incomes = useSelector(state => state.incomes.incomes[selectedYear]);
  const savings = useSelector(state => state.savings.savings[selectedYear]);
  const investments = useSelector(state => state.savings.investments[selectedYear]);

  const months = Object.keys(expenses).map(monthString => Number(monthString)).reverse();

  const route = useRoute();
  const overviewType = route.params?.type;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTab({ selectedTab: overviewType }));
    }
  }, [route]);

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View style={styles.overviewScreen}>
        <View style={styles.listContainer}>
          {overviewType === months.map((monthNumber, index) => (
            <OverviewMonth
              key={index}
              style={[styles.overviewMonth, index === 0 && { marginTop: 0 }]}
              year={selectedYear}
              monthNumber={monthNumber}
              expenses={expenses[monthNumber]}
              incomes={incomes[monthNumber]}
              savings={savings[monthNumber]}
              investments={investments[monthNumber]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overviewScreen: {
    height: '100%',
    paddingHorizontal: 52,
    backgroundColor: COLOR.WHITE,
  },

  listContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 1280,
    paddingTop: 40,
    paddingBottom: 80,
    alignSelf: 'center',
  },

  overviewMonth: {
    marginTop: 60,
  },
});
