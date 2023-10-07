import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTab } from '../../redux/reducers/ui';

export default function OverviewScreen () {
  const dispatch = useDispatch();
  const selectedTab = useSelector(state => state.ui.selectedTab);

  const route = useRoute();
  const overviewType = route.params?.type;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTab({ selectedTab: overviewType }));
    }
  }, [route]);

  return (
    <View style={styles.overviewScreen}>
      <Text style={styles.title}>
        Overview: {overviewType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 14,
  },
});
