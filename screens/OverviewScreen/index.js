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

  console.info('expenses', expenses);

  const months = Object.keys(expenses).map(monthString => Number(monthString)).reverse();

  const route = useRoute();
  const overviewType = route.params?.type;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTab({ selectedTab: overviewType }));
    }
  }, [route]);

  return (
    <View style={styles.overviewScreen}>
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={styles.listContainer}>
          {months.map((monthNumber) => (
            <OverviewMonth
              key={monthNumber}
              style={styles.overviewMonth}
              monthNumber={monthNumber}
              expenses={expenses[monthNumber]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewScreen: {
    flexGrow: 1,
    paddingHorizontal: 52,
    backgroundColor: COLOR.WHITE,
  },

  listContainer: {
    width: '100%',
    maxWidth: 1024,
    alignSelf: 'center',
  },

  overviewMonth: {
    marginTop: 60,
  },
});
