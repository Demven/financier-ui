import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTabAction } from '../../redux/reducers/ui';

export default function CategoriesScreen () {
  const dispatch = useDispatch();
  const selectedTab = useSelector(state => state.ui.selectedTab);

  const route = useRoute();
  const overviewType = route.params?.type;

  useEffect(() => {
    if (overviewType !== selectedTab) {
      dispatch(setSelectedTabAction(overviewType));
    }
  }, [route]);

  return (
    <View style={styles.categoriesScreen}>
      <Text style={styles.title}>
        Categories: {overviewType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontSize: 14,
  },
});
